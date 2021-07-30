const path = require('path');
const getNodeProperty = require('./utils.js');

/**
 * Checks if the call expression matches a test setup call pattern.
 * @param {object} Babel node object
 * @param {object} t Babel types
 * @param {string} hooksIdentifier - "hooks" passed into module's function arg
 * @returns {Boolean} - if the call expression has a setup call pattern,
 *   e.g. setupApplication(hooks), then return true
 */
function isSetupCall({ node }, t, hooksIdentifier) {
  return (
    t.isCallExpression(node.expression) &&
    t.isIdentifier(node.expression.arguments[0]) &&
    node.expression.arguments[0].name === hooksIdentifier
  );
}

/**
 * Gets the last setup call expression node path.
 * @param {array} callsArray Babel array of call expression node paths representing calls within a function block
 * @param {object} t Babel types
 * @param {string} hooksIdentifier - "hooks" passed into module's function arg
 * @returns {object} a Babel node path that is the last setup call expression, e.g. setupApplication(hooks)
 */
function getLastSetupCall(callsArray, t, hooksIdentifier) {
  if (callsArray.length === 1 && isSetupCall(callsArray[0], t, hooksIdentifier))
    return callsArray[0];

  for (let nextCall, i = 0; i < callsArray.length; i++) {
    nextCall = callsArray[i + 1];
    if (nextCall && !isSetupCall(nextCall, t, hooksIdentifier)) {
      return callsArray[i];
    }
  }
}

/**
 * Checks if the node is a beforeEach call.
 * @param {object} node Babel node expression path
 * @returns {Boolean}
 */
function isBeforeEach(node) {
  const calleePropertyName = getNodeProperty(node, 'property.name');
  return calleePropertyName === 'beforeEach';
}

/**
 * Gets any existing beforeEach call as a node path.
 * @param {array} nodes Babel array of node paths within a function block
 * @returns {object} Babel node path call expression of a beforeEach call
 */
function getExistingBeforeEach(nodes, t) {
  for (const node of nodes) {
    if (
      t.isExpressionStatement(node) &&
      isBeforeEach(getNodeProperty(node, 'node.expression.callee'))
    ) {
      return node.get('expression');
    }
  }
}

/**
 * Adds test metadata statements to the top of an existing beforeEach call function block.
 * Updates state.opts.transformedModules [] with the name of the test module transformed.
 * @param {object} state - Babel state
 * @param {object} beforeEachExpression - the beforeEach Babel call expression
 * @param {object} t Babel types
 */
function insertMetaDataInBeforeEach(state, beforeEachExpression, t) {
  const testMetadataVarDeclaration = getTestMetadataDeclaration(state, t);
  const testMetadataAssignment = getTestMetadataAssignment(state, t);

  const functionBlock = beforeEachExpression.get('arguments')[0];
  const functionBlockBody = functionBlock.get('body');
  const functionBlockBodyStatementsArray = functionBlockBody
    ? functionBlockBody.get('body')
    : [];
  let existingMetadataDeclaration;

  if (functionBlockBodyStatementsArray.length > 0) {
    existingMetadataDeclaration = functionBlockBodyStatementsArray.find(
      (node) => hasMetadataDeclaration(node)
    );
  }

  if (!existingMetadataDeclaration) {
    functionBlockBody.unshiftContainer('body', testMetadataAssignment);
    functionBlockBody.unshiftContainer('body', testMetadataVarDeclaration);

    state.opts.transformedModules.push(state.opts.moduleName);
  }
}

/**
 * Creates a new beforeEach call with the test metadata statements.
 * Inserts this new beforeEach below any existing setup calls, else
 * at the top of the test module function block.
 * Updates state.opts.transformedModules [] with the name of the test module transformed.
 * @param {object} state - Babel state
 * @param {object} t  - Babel types
 */
function insertNewBeforeEach(state, t) {
  const testMetadataVarDeclaration = getTestMetadataDeclaration(state, t);
  const testMetadataAssignment = getTestMetadataAssignment(state, t);
  const beforeEachFunc = t.functionExpression(
    null,
    [],
    t.blockStatement([testMetadataVarDeclaration, testMetadataAssignment])
  );
  const beforeEachExpression = t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        t.identifier(state.opts.hooksIdentifier),
        t.identifier('beforeEach')
      ),
      [beforeEachFunc]
    )
  );

  if (state.opts.setupCall) {
    state.opts.setupCall.insertAfter(beforeEachExpression);
  } else {
    const moduleFunctionBlockBody = state.opts.moduleFunction.get('body');
    moduleFunctionBlockBody.unshiftContainer('body', beforeEachExpression);
  }

  state.opts.transformedModules.push(state.opts.moduleName);
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
    [t.identifier('QUnit.config.current.testEnvironment')]
  );

  return t.variableDeclaration('let', [
    t.variableDeclarator(
      t.identifier('testMetadata'),
      getTestMetadataExpression
    ),
  ]);
}

/**
 * Checks whether a test metadata statement already exists.
 * @param {object} node - Babel node path
 * @param {object} t - Babel types
 * @returns {Boolean}
 */
function hasMetadataDeclaration({ node }) {
  return (
    getNodeProperty(node.expression, 'left.object.name') === 'testMetadata' &&
    getNodeProperty(node.expression, 'left.property.name') === 'filePath'
  );
}

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

        state.opts.transformedModules = [];
        state.opts.setupCall;
        state.opts.moduleFunction;
        state.opts.hooksIdentifier;
        state.opts.getTestMetadataUID =
          babelPath.scope.generateUidIdentifier(GET_TEST_METADATA);

        let importDeclarations = babelPath
          .get('body')
          .filter((n) => n.type === 'ImportDeclaration');
        let emberTestHelpersIndex = importDeclarations.findIndex(
          (n) => n.get('source').get('value').node === '@ember/test-helpers'
        );

        const getTestMetaDataImportSpecifier = t.importSpecifier(
          state.opts.getTestMetadataUID,
          t.identifier(GET_TEST_METADATA)
        );

        if (emberTestHelpersIndex !== -1) {
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
        if (!state.opts.shouldLoadFile) return;

        let moduleName;
        let moduleFunction;

        // If this call expression is a top-level module, store module name string, else skip the nested module entirely
        if (babelPath.get('callee').isIdentifier({ name: 'module' })) {
          if (babelPath.parentPath.parent.type === 'Program') {
            [moduleName, moduleFunction] = babelPath.get('arguments');

            const hasModuleFunction = t.isFunction(moduleFunction);

            // If no 2nd arg function is passed into module(), assume it's using old test syntax,
            // which will be supported separately. Skip entirely for now.
            if (!hasModuleFunction) {
              return;
            }

            const moduleFunctionParams = moduleFunction
              ? moduleFunction.get('params')
              : [];

            state.opts.hooksIdentifier = getNodeProperty(
              moduleFunctionParams[0],
              'node.name'
            );
            state.opts.moduleName = moduleName.node.value;
            state.opts.moduleFunction = moduleFunction;
          }
        }

        if (
          state.opts.moduleName &&
          !state.opts.transformedModules.includes(state.opts.moduleName)
        ) {
          if (!state.opts.hooksIdentifier) {
            state.opts.moduleFunction.node.params.push(t.Identifier('hooks'));
            state.opts.hooksIdentifier = 'hooks';
          }

          const moduleFunctionBlock = state.opts.moduleFunction.get('body');
          const moduleFunctionBodyArray = moduleFunctionBlock.get('body');
          const existingBeforeEach = getExistingBeforeEach(
            moduleFunctionBodyArray,
            t
          );
          const beforeEachArgIsFunction =
            existingBeforeEach &&
            t.isFunction(existingBeforeEach.get('arguments')[0]);

          if (existingBeforeEach && beforeEachArgIsFunction) {
            insertMetaDataInBeforeEach(state, existingBeforeEach, t);
          } else {
            const lastSetupCall = getLastSetupCall(
              moduleFunctionBodyArray,
              t,
              state.opts.hooksIdentifier
            );
            state.opts.setupCall = lastSetupCall;
            insertNewBeforeEach(state, t);
          }
        }
      },
    },
  };
}

module.exports = addMetadata;
