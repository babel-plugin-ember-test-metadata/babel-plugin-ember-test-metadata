const path = require('path');

/**
 * Write the test metadata expressions to the body of the node
 * @param {object} state - Babel state
 * @param {object} node - Babel node
 * @param {object} t  - Babel types
 */
function writeTestMetadataExpressions(state, node, t) {
  const testMetadataVarDeclaration = getTestMetadataDeclaration(t);
  const testMetadataAssignment = getTestMetadataAssignment(state, t);
  const { body } = node.arguments[0].body;

  body.unshift(testMetadataAssignment);
  body.unshift(testMetadataVarDeclaration);
}

/**
 * Get the test metadata assignment expression
 * @param {object} state - Babel state
 * @param {object} t  - Babel types
 * @returns Babel assignment expression
 */
function getTestMetadataAssignment(state, t) {
  const { root, filename } = state.file.opts;
  const relativeFilePath = path.relative(root, filename);

  return t.assignmentExpression(
    '=',
    t.memberExpression(t.identifier('testMetadata'), t.identifier('filePath')),
    t.stringLiteral(relativeFilePath)
  );
}

/**
 * Get the test metadata variable declaration
 * @param {object} t - Babel types
 * @returns Babel variable declaration
 */
function getTestMetadataDeclaration(t) {
  const getTestMetadataExpression = t.callExpression(
    t.identifier('getTestMetadata'),
    [t.thisExpression()]
  );

  return t.variableDeclaration('let', [
    t.variableDeclarator(
      t.identifier('testMetadata'),
      getTestMetadataExpression
    ),
  ]);
}

/**
 * Babel plugin for Ember apps that adds the filepath of the test file that Babel is processing, to
 * the testMetadata. It does this by making the following transformations to the test file:
 * 1. imports "getTestMetadata" from @ember/test-helpers
 * 2. adds a new beforeEach or modifies any existing beforeEach to include testMetadata expressions that add
 *   filepath to testMetadata
 * e.g. The transformed beforeEach would look like:
          hooks.beforeEach(function () {
            let testMetadata = getTestMetadata(this);
            testMetadata.filePath =
              'test/__fixtures__/one-module-no-beforeeach-test-member-code.js';
          });
 * Only 1 beforeEach should apply for each top-level module (in Qunit there can be sibling and/or nested modules),
 * and so only 1 top-level beforeEach will be added/transformed. It will be added just before any calls to
 * "test() or module()" which places it after any setup-based expressions.
 *
 * @param {object} Babel object
 * @returns Babel plugin object with Program and CallExpression visitors
 */
export function addMetadata({ types: t }) {
  // TODO: Refactor to properly use state.opts
  let beforeEachModified = false;

  return {
    name: 'addMetadata',
    visitor: {
      Program({ node }) {
        const EMBER_TEST_HELPERS = '@ember/test-helpers';
        const GET_TEST_METADATA = 'getTestMetadata';
        const imports = node.body.filter(maybeImport => {
          return maybeImport.type === 'ImportDeclaration';
        });
        const emberTestHelpers = imports.filter(
          imp => imp.source.value === EMBER_TEST_HELPERS
        );
        const importExists =
          emberTestHelpers !== undefined && emberTestHelpers.length > 0;

        if (importExists) {
          // Append to existing test-helpers import
          emberTestHelpers[0].specifiers.push(t.identifier(GET_TEST_METADATA));
        } else {
          const getTestMetaDataImportSpecifier = t.importSpecifier(
            t.identifier(GET_TEST_METADATA),
            t.identifier(GET_TEST_METADATA)
          );
          const getTestMetaDataImportDeclaration = t.importDeclaration(
            [getTestMetaDataImportSpecifier],
            t.stringLiteral(EMBER_TEST_HELPERS)
          );

          node.body.splice(imports.length, 0, getTestMetaDataImportDeclaration);
        }
      },

      CallExpression(babelPath, state) {
        // Reset at top-level module
        if (babelPath.scope.block.type === 'Program')
          beforeEachModified = false;

        if (!beforeEachModified) {
          const BEFORE_EACH = 'beforeEach';
          // TODO: Refactor, remove skip and todo as these are not primary calls
          const testMethodNames = ['test', 'skip', 'todo', 'module'];
          const nodeName =
            babelPath.node.callee.name || babelPath.node.callee.object.name;
          const shouldAddToExistingBeforeEach =
            babelPath.node.callee.property &&
            babelPath.node.callee.property.name === BEFORE_EACH;

          if (shouldAddToExistingBeforeEach) {
            writeTestMetadataExpressions(state, babelPath.node, t);
            beforeEachModified = true;
          } else if (
            // TODO: refactor out during state.opts and skip/todo clean-up
            testMethodNames.includes(nodeName) &&
            babelPath.scope.path.parentPath &&
            babelPath.scope.path.parentPath.node.callee.name === 'module'
          ) {
            const testMetadataVarDeclaration = getTestMetadataDeclaration(t);
            const testMetadataAssignment = getTestMetadataAssignment(state, t);
            const beforeEachFunc = t.functionExpression(
              null,
              [],
              t.blockStatement([
                testMetadataVarDeclaration,
                t.expressionStatement(testMetadataAssignment),
              ])
            );
            const beforeEach = t.callExpression(
              t.memberExpression(
                t.identifier('hooks'),
                t.identifier(BEFORE_EACH)
              ),
              [beforeEachFunc]
            );

            // TODO: Refactor/clean-up during skip/todo work, to clarify what "babelPath.insertBefore()" is doing.
            babelPath.insertBefore(beforeEach);

            beforeEachModified = true;
          }
        }
      },
    },
  };
}
