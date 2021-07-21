const path = require('path');

function isSetupCall({ node }, t, hooksIdentifier) {
  return (
    t.isCallExpression(node.expression) &&
    t.isIdentifier(node.expression.arguments[0]) &&
    node.expression.arguments[0].name === hooksIdentifier
  );
}

function getLastSetupCall(callsArray, t, hooksIdentifier) {
  if (callsArray.length === 1 && isSetupCall(callsArray[0], t, hooksIdentifier))
    return callsArray[0];

  for (let i = 0; i < callsArray.length; i++) {
    if (
      callsArray[i + 1] &&
      !isSetupCall(callsArray[i + 1], t, hooksIdentifier)
    ) {
      return callsArray[i];
    }
  }
}

function isBeforeEach(callee) {
  return callee.property && callee.property.name === 'beforeEach';
}

function getExistingBeforeEach(callsArray) {
  for (let i = 0; i < callsArray.length; i++) {
    if (isBeforeEach(callsArray[i].node.expression.callee)) {
      return callsArray[i].get('expression');
    }
  }
}

function addMetaDataToBeforeEach(state, beforeEachExpression, t) {
  const testMetadataVarDeclaration = getTestMetadataDeclaration(state, t);
  const testMetadataAssignment = getTestMetadataAssignment(state, t);

  const functionBlock = beforeEachExpression.get('arguments')[0];
  const functionBlockBody = functionBlock.get('body');
  const functionBlockBodyStatementsArray = functionBlockBody.get('body');
  let existingMetadataDeclaration;

  if (functionBlockBodyStatementsArray.length > 0) {
    existingMetadataDeclaration = functionBlockBodyStatementsArray.find(
      (node) => hasMetadataDeclaration(node, t)
    );
  }

  if (!existingMetadataDeclaration) {
    functionBlockBody.unshiftContainer('body', testMetadataAssignment);
    functionBlockBody.unshiftContainer('body', testMetadataVarDeclaration);

    state.opts.transformedModules.push(state.opts.moduleName);
  }
}

function writeNewBeforeEach(state, t) {
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
    [t.thisExpression()]
  );

  return t.variableDeclaration('let', [
    t.variableDeclarator(
      t.identifier('testMetadata'),
      getTestMetadataExpression
    ),
  ]);
}

function hasMetadataDeclaration({ node }, t) {
  if (
    !node.expression ||
    !t.isAssignmentExpression(node.expression) ||
    !node.expression.left.object ||
    !node.expression.left.property
  ) {
    return false;
  }

  return (
    node.expression.left.object.name === 'testMetadata' &&
    node.expression.left.property.name === 'filePath'
  );
}

function getNodeProperty(node, path) {
  if (!node) {
    return;
  }

  let parts;
  if (typeof path === 'string') {
    parts = path.split('.');
  } else {
    parts = path;
  }

  if (parts.length === 1) {
    return node[path];
  }

  let property = node[parts[0]];

  if (property && parts.length > 1) {
    parts.shift();
    return getNodeProperty(property, parts);
  }

  return property;
}

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
        state.opts.hasModuleFunction;
        state.opts.hooksIdentifier;

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

        let moduleName;
        let moduleFunction;

        // If this call expression is a top-level module, store module name string, else skip the nested module entirely
        if (babelPath.get('callee').isIdentifier({ name: 'module' })) {
          if (babelPath.parentPath.parent.type === 'Program') {
            [moduleName, moduleFunction] = babelPath.get('arguments');

            const moduleFunctionParams = moduleFunction
              ? moduleFunction.get('params')
              : [];

            state.opts.hooksIdentifier = getNodeProperty(
              moduleFunctionParams[0],
              'node.name'
            );
            state.opts.moduleName = moduleName.node.value;
            state.opts.moduleFunction = moduleFunction;
          } else {
            // skip traversing contents in this nested module
            babelPath.skip();
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
            t,
            state.opts.hooksIdentifier
          );

          if (existingBeforeEach) {
            addMetaDataToBeforeEach(state, existingBeforeEach, t);
          } else {
            const lastSetupCall = getLastSetupCall(
              moduleFunctionBodyArray,
              t,
              state.opts.hooksIdentifier
            );
            state.opts.setupCall = lastSetupCall;
            writeNewBeforeEach(state, t);
          }
        }
      },
    },
  };
}

module.exports = addMetadata;
