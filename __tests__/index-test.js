const pluginTester = require('babel-plugin-tester').default;
const addMetadata = require('../src/index');
const path = require('path');

pluginTester({
  plugin: addMetadata,
  pluginName: 'addMetadata',
  snapshot: true,
  tests: [
    {
      title:
        'for a single beforeEach in a single module, it adds a new import and getTestMetadata statements',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-one-beforeeach-new-import-input-test.js'
      ),
    },
    {
      title:
        'for beforeEach in multiple modules, it adds a new import and multiple getTestMetadata statements',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'multiple-module-one-beforeeach-new-import-input-test.js'
      ),
    },
    {
      title:
        'for a module that already imports from @ember/test-helpers, it adds getTestMetadata to the import',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-one-beforeeach-import-exists-input-test.js'
      ),
    },
    {
      title:
        'for a single module without any beforeEach, it adds a new beforeEach & getTestMetadata statements',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-beforeeach-import-exists-input-test.js'
      ),
    },
    {
      title: `for a single module without any beforeEach and a memberExpression test call,
       it adds a new beforeEach & getTestMetadata statements`,
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-beforeeach-test-member-input-test.js'
      ),
    },
    {
      title:
        'for a module with a beforeEach that is passed an async function callback, getTestMetadata statements are adding correctly',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-one-async-beforeeach-new-import-input-test.js'
      ),
    },
    {
      title:
        'for multiple sibling modules without any beforeEach, it adds a new beforeEach & getTestMetadata statements',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'multiple-module-no-beforeeach-import-exists-input-test.js'
      ),
    },
    {
      title:
        'for nested modules without any beforeEach, it adds a new beforeEach before the first nested module call',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'nested-modules-no-beforeeach-import-exists-input-test.js'
      ),
    },
    {
      title:
        'for nested modules with beforeEach, it adds a new beforeEach before only the first nested module call',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'nested-modules-with-beforeeach-import-exists-input-test.js'
      ),
    },
    {
      title:
        'for a module without any beforeEach and without any setup calls, it adds a new beforeEach at the top of the module',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-beforeeach-no-hooks-no-setup-test.js'
      ),
    },
    {
      title:
        "for a module's function param that does not pass in hooks, pass in hooks",
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-beforeeach-no-hooks-test.js'
      ),
    },
    {
      title:
        'for a module without a beforeEach and where its function param passes in a custom hooks name, create our new beforeEach called from their custom hooks object',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-beforeeach-custom-hooks-name-test.js'
      ),
    },
    {
      title:
        'for a module without a beforeEach and with multiple setup calls, insert our new beforeEach after the setup calls',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-beforeeach-multiple-setup-calls-test.js'
      ),
    },
    {
      title: 'for a module that has no function passed in, skip it',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-no-module-function-test.js'
      ),
    },
    {
      title:
        'for a module with a beforeEach that is passed in an identifier (non-inline function), add our new beforeEach above theirs',
      fixture: path.join(
        __dirname,
        '__fixtures__/',
        'one-module-one-beforeeach-arg-not-inline-func-test.js'
      ),
    },
  ],
});
