const pluginTester = require('babel-plugin-tester').default;
const { addMetadata } = require('../src/index');
const path = require('path');

pluginTester({
  plugin: addMetadata,
  pluginName: 'addMetadata',
  tests: [
    {
      title: 'for a single beforeEach in a single module, it adds a new import and getTestMetadata statements',
      fixture: path.join(__dirname, '__fixtures__/', 'one-module-one-beforeeach-new-import-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'one-module-one-beforeeach-new-import-output.js'),
    },
    {
      title: 'for beforeEach in multiple modules, it adds a new import and multiple getTestMetadata statements',
      fixture: path.join(__dirname, '__fixtures__/', 'multiple-module-one-beforeeach-new-import-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'multiple-module-one-beforeeach-new-import-output.js'),
    },
    {
      title: 'for a module that already imports from @ember/test-helpers, it adds getTestMetadata to the import',
      fixture: path.join(__dirname, '__fixtures__/', 'one-module-one-beforeeach-import-exists-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'one-module-one-beforeeach-import-exists-output.js'),
    },
    {
      title: 'for a single module without any beforeEach, it adds a new beforeEach & getTestMetadata statements',
      fixture: path.join(__dirname, '__fixtures__/', 'one-module-no-beforeeach-import-exists-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'one-module-no-beforeeach-import-exists-output.js'),
    },
    {
      title: `for a single module without any beforeEach and a memberExpression test call,
       it adds a new beforeEach & getTestMetadata statements`,
      fixture: path.join(__dirname, '__fixtures__/', 'one-module-no-beforeeach-test-member-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'one-module-no-beforeeach-test-member-output.js'),
    },
    {
      title: 'for multiple sibling modules without any beforeEach, it adds a new beforeEach & getTestMetadata statements',
      fixture: path.join(__dirname, '__fixtures__/', 'multiple-module-no-beforeeach-import-exists-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'multiple-module-no-beforeeach-import-exists-output.js'),
    },
    {
      title: 'for modules without any beforeEach, it adds a new beforeEach after the first call of either "test", "skip" or "todo"',
      fixture: path.join(__dirname, '__fixtures__/', 'multiple-module-no-beforeeach-test-skip-todo-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'multiple-module-no-beforeeach-test-skip-todo-output.js'),
    },
    {
      title: 'for nested modules without any beforeEach, it adds a new beforeEach before the first nested module call',
      fixture: path.join(__dirname, '__fixtures__/', 'nested-modules-no-beforeeach-import-exists-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'nested-modules-no-beforeeach-import-exists-output.js'),
    },
    {
      title: 'for nested modules with beforeEach, it adds a new beforeEach before only the first nested module call',
      fixture: path.join(__dirname, '__fixtures__/', 'nested-modules-with-beforeeach-import-exists-code.js'),
      outputFixture: path.join(__dirname, '__fixtures__/', 'nested-modules-with-beforeeach-import-exists-output.js'),
    },
  ]
});
