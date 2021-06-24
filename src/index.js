const path = require('path');

/**
 * Write the test metadata expressions either into the body of the existing beforeEach, or
 * wrapped in a new beforeEach which is inserted just above the given babelPath
 * @param {object} state - Babel state
 * @param {object} babelPath - Babel path
 * @param {object} t  - Babel types
 * @param {boolean} hasBeforeEach  - if true, write expressions into existing beforeEach,
 *   otherwise write a new beforeEach
 */
function writeTestMetadataExpressions(state, babelPath, t, hasBeforeEach) {
  const testMetadataVarDeclaration = getTestMetadataDeclaration(state, t);
  const testMetadataAssignment = getTestMetadataAssignment(state, t);

  if (hasBeforeEach) {
    const functionBlock = babelPath.get('arguments')[0];
    const functionBlockBody = functionBlock.get('body');
    const functionBlockBodyStatementsArray = functionBlockBody.get('body');
    let existingMetadataDeclaration;

    if (functionBlockBodyStatementsArray.length > 0) {
      existingMetadataDeclaration = functionBlockBodyStatementsArray.find(
        hasMetadataDeclaration
      );
    }

    if (!existingMetadataDeclaration) {
      functionBlockBody.unshiftContainer('body', testMetadataAssignment);
      functionBlockBody.unshiftContainer('body', testMetadataVarDeclaration);
    }
  } else {
    const beforeEachFunc = t.functionExpression(
      null,
      [],
      t.blockStatement([testMetadataVarDeclaration, testMetadataAssignment])
    );
    const beforeEachExpression = t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier('hooks'), t.identifier('beforeEach')),
        [beforeEachFunc]
      )
    );

    babelPath.insertBefore(beforeEachExpression);
  }
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

  return t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        t.identifier('testMetadata'),
        t.identifier('filePath')
      ),
      t.stringLiteral(relativeFilePath)
    )
  );
}

/**
 * Get the test metadata variable declaration
 * @param {object} t - Babel types
 * @returns Babel variable declaration
 */
function getTestMetadataDeclaration(state, t) {
  const getTestMetadataExpression = t.callExpression(
    t.identifier(state.opts.getTestMetadataUID.name),
    [t.thisExpression()]
  );

  return t.variableDeclaration('let', [
    t.variableDeclarator(
      t.identifier('testMetadata'),
      getTestMetadataExpression
    ),
  ]);
}

function shouldLoadFile(filename) {
  return filename.match(/[-_]test\.js/gi);
}

function hasMetadataDeclaration({ node }) {
  if (node.expression && node.expression.type === 'AssignmentExpression') {
    return (
      node.expression.left.object.name === 'testMetadata' &&
      node.expression.left.property.name === 'filePath'
    );
  } else {
    return false;
  }
}

/**
 * Babel plugin for Ember apps that adds the filepath of the test file that Babel is processing, to
 * the testMetadata. It does this by making the following transformations to the test file:
 * 1. imports "getTestMetadata" from @ember/test-helpers
 * 2. adds a new beforeEach or transforms any existing beforeEach to include testMetadata expressions that add
 *   filepath to testMetadata
 * @param {object} Babel object
 * @returns Babel plugin object with Program and CallExpression visitors
 */
function addMetadata({ types: t }) {
  return {
    name: 'addMetadata',
    visitor: {
      Program(babelPath, state) {
        const GET_TEST_METADATA = 'getTestMetadata';
        const { filename } = state.file.opts;
        state.opts.shouldLoadFile = shouldLoadFile(filename);

        if (!state.opts.shouldLoadFile) {
          return;
        }

        let importDeclarations = babelPath
          .get('body')
          .filter((n) => n.type === 'ImportDeclaration');
        let emberTestHelpersIndex = importDeclarations.findIndex(
          (n) => n.get('source').get('value').node === '@ember/test-helpers'
        );

        state.opts.getTestMetadataUID =
          babelPath.scope.generateUidIdentifier(GET_TEST_METADATA);

        const getTestMetaDataImportSpecifier = t.importSpecifier(
          state.opts.getTestMetadataUID,
          t.identifier(GET_TEST_METADATA)
        );

        if (emberTestHelpersIndex > 0) {
          // Append to existing test-helpers import
          importDeclarations[emberTestHelpersIndex]
            .get('body')
            .container.specifiers.push(getTestMetaDataImportSpecifier);
        } else {
          const getTestMetaDataImportDeclaration = t.importDeclaration(
            [getTestMetaDataImportSpecifier],
            t.stringLiteral('@ember/test-helpers')
          );

          babelPath.unshiftContainer('body', getTestMetaDataImportDeclaration);
        }
      },

      /**
       * Do transforms for adding our test metadata expressions to beforeEach.
       * For each top-level module (in QUnit there can be sibling and/or nested modules), only 1 beforeEach should apply,
       * and so only 1 beforeEach will be added/transformed per top-level module. As Babel traverses through each call
       * expression, we're only concerned about operating on call expressions inside of top-level module calls.
       *
       * While inside a top-level module, we check the current call expression for either of these conditions:
       *   1. if it's a beforeEach, then we add our test metadata expressions to it.
       *   2. if it's a call to either "test" or to a nested "module", then we want to add a new beforeEach just above it
       * If the current call is neither of these, then do nothing. Babel will move on to the next call expression.
       *
       * The transformed beforeEach would look like:
          hooks.beforeEach(function () {
            let testMetadata = getTestMetadata(this);
            testMetadata.filePath = 'test/my-test.js';
          });
       * @param {object} babelPath
       * @param {object} state
       */
      CallExpression(babelPath, state) {
        if (!state.opts.shouldLoadFile) return;

        // If we're at a top-level call expression, then we reset the beforeEachModified state to false, and let Babel
        // move on to the next call expression.
        if (babelPath.scope.block.type === 'Program') {
          state.opts.beforeEachModified = false;
          return;
        }

        if (!state.opts.beforeEachModified) {
          const hasBeforeEach = babelPath.node.callee.property
            ? babelPath.node.callee.property.name === 'beforeEach'
            : false;
          const testMethodCalls = ['test', 'module'];

          let nodeName = '';

          if (babelPath.node.callee.name) {
            nodeName = babelPath.node.callee.name;
          } else if (babelPath.node.callee.object) {
            nodeName = babelPath.node.callee.object.name;
          }

          const isFirstChildTestMethodCall =
            testMethodCalls.includes(nodeName) &&
            babelPath.scope.path.parentPath &&
            babelPath.scope.path.parentPath.node.callee.name === 'module';

          const shouldDoTransform = hasBeforeEach || isFirstChildTestMethodCall;

          if (shouldDoTransform) {
            writeTestMetadataExpressions(state, babelPath, t, hasBeforeEach);
            state.opts.beforeEachModified = true;
          }
        }
      },
    },
  };
}

module.exports = addMetadata;
