const { getNodeProperty, getNormalizedFilePath } = require('./utils.js');

/**
 * Checks for files ending with "-test.js" or "_test.js"
 * @param {string} filename File name which may include file path
 * @returns {Boolean}
 */
function shouldLoadFile(filename) {
  return filename.match(/[-_]test\.js/gi);
}

/**
 * Babel plugin for Ember apps that adds the filepath of the test file that Babel is processing, to
 * the testMetadata. It does this by making the following transformations to the test file:
 * 1. imports "getTestMetadata" from @ember/test-helpers
 * 2. adds a new beforeEach that includes testMetadata expressions that add
 *   filepath to testMetadata
 * @param {object} Babel object
 * @returns Babel plugin object with Program and CallExpression visitors
 */
function addMetadata({ types: t }) {
  return {
    name: 'addMetadata',
    visitor: {
      Program(babelPath, state) {
        if (!state.opts.enabled) return;

        const { filename } = state.file.opts;
        state.opts.shouldLoadFile = shouldLoadFile(filename);

        if (!state.opts.shouldLoadFile) return;

        const metadata = babelPath
          .get('body')
          .filter((n) => n.type === 'ImportDeclaration')
          .find((n) => {
            return n
              .get('specifiers')
              .some(
                (s) =>
                  getNodeProperty(
                    s.get('container'),
                    'container.imported.name'
                  ) === 'getTestMetadata'
              );
          });

        if (metadata) {
          return;
        }

        const identifier = t.identifier('getTestMetadata');
        const importSpecifier = t.importSpecifier(identifier, identifier);

        babelPath.unshiftContainer(
          'body',
          t.importDeclaration(
            [importSpecifier],
            t.stringLiteral('@ember/test-helpers')
          )
        );
      },

      /**
       * For each top-level module (in QUnit there can be sibling and/or nested modules), only 1 beforeEach should apply,
       * and so only 1 beforeEach will be added/transformed per top-level module.
       *
       * The transformed beforeEach would look like:
          hooks.beforeEach(function () {
            let testMetadata = getTestMetadata(<test context>);
            testMetadata.filePath = 'test/my-test.js';
          });
       * @param {object} babelPath
       * @param {object} state
       */
      CallExpression(babelPath, state) {
        if (
          !state.opts.enabled ||
          !state.opts.shouldLoadFile ||
          !babelPath.get('callee').isIdentifier({ name: 'module' }) ||
          babelPath.parentPath.parent.type !== 'Program'
        ) {
          return;
        }

        let moduleName;
        let moduleFunction;

        [moduleName, moduleFunction] = babelPath.get('arguments');

        if (!moduleName || !moduleFunction || !t.isFunction(moduleFunction)) {
          return;
        }

        let hooksIdentifier = getNodeProperty(
          moduleFunction.get('params')[0],
          'node.name'
        );

        if (!hooksIdentifier) {
          hooksIdentifier = 'hooks';
          moduleFunction.node.params.push(t.Identifier(hooksIdentifier));
        }

        const testMetadataVarDeclaration = t.variableDeclaration('let', [
          t.variableDeclarator(
            t.identifier('testMetadata'),
            t.callExpression(t.identifier('getTestMetadata'), [
              t.identifier('QUnit.config.current.testEnvironment'),
            ])
          ),
        ]);

        const relativeFilePath = getNormalizedFilePath(
          state.file.opts,
          state.opts.projectConfiguration
        );

        const testMetadataAssignment = t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(
              t.identifier('testMetadata'),
              t.identifier('filePath')
            ),
            t.stringLiteral(relativeFilePath)
          )
        );

        const beforeEachFunc = t.functionExpression(
          null,
          [],
          t.blockStatement([testMetadataVarDeclaration, testMetadataAssignment])
        );

        const beforeEachExpression = t.expressionStatement(
          t.callExpression(
            t.memberExpression(
              t.identifier(hooksIdentifier),
              t.identifier('beforeEach')
            ),
            [beforeEachFunc]
          )
        );

        moduleFunction
          .get('body')
          .unshiftContainer('body', beforeEachExpression);
      },
    },
  };
}

module.exports = addMetadata;
