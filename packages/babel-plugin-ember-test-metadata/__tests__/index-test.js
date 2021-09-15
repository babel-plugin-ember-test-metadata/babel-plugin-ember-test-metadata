const pluginTester = require('babel-plugin-tester').default;
const addMetadata = require('../index');
const path = require('path');

const projectConfiguration = {
  pkg: {
    name: 'packages/babel-plugin-ember-test-metadata',
    'ember-addon': {},
  },
};

pluginTester({
  plugin: addMetadata,
  pluginName: 'addMetadata',
  snapshot: true,
  pluginOptions: { enabled: true, projectConfiguration },
  tests: [
    {
      title: 'for a module with hooks it adds getTestMetadata',
      fixture: path.join(__dirname, '__fixtures__', 'with-hooks-test.js'),
    },
    {
      title: 'for a module with no hooks it adds test metadata',
      fixture: path.join(__dirname, '__fixtures__', 'without-hooks-test.js'),
    },
    {
      title: 'with existing metadata import it reuses the import',
      fixture: path.join(__dirname, '__fixtures__', 'with-get-test-metadata-test.js'),
    },
    {
      title: 'with multiple sibling modules',
      fixture: path.join(__dirname, '__fixtures__', 'with-multiple-modules-test.js'),
    },
    {
      title: 'with no module callback it does not add a beforeEach',
      fixture: path.join(__dirname, '__fixtures__', 'with-no-module-callback-test.js'),
    },
    {
      title: 'Embroider build path',
      fixture: path.join(
        __dirname,
        '__fixtures__',
        'temp-test-123',
        'embroider',
        '123456',
        'pathtest',
        'embroider-prefix-test.js'
      ),
    },
  ],
});
