const { Scenarios, Project } = require('scenario-tester');
const { join, dirname } = require('path');
const { readFileSync } = require('fs');
const { merge } = require('lodash');

jest.setTimeout(500000);

async function workspaces(project) {
  merge(project.files, {
    'ember-cli-build.js': `'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [
        [
          require.resolve('babel-plugin-ember-test-metadata'),
          {
            enabled: true,
            workspaceRoot: 'packages',
            packageName: defaults.project.pkg.name,
          }
        ]
      ],
    }
  });

  return app.toTree();
};
`,
    tests: {
      unit: getTestFiles(
        'with-packages-test.js'
      ),
    }
  });
}

function getTestFiles(...files) {
  return files.reduce((testFiles, file) => {
    testFiles[file] = readFileSync(join(__dirname, '__fixtures__', file), { encoding: 'utf-8' });

    return testFiles;
  }, {});
}

function baseApp() {
  return Project.fromDir(
    // eslint-disable-next-line node/no-unpublished-require
    dirname(require.resolve('../../workspace-template/packages/extended/package.json')),
    {
      linkDeps: true,
    }
  );
}

Scenarios.fromProject(baseApp)
  .expand({
    workspaces
  })
  .map('app scenarios', (project) => {
    project.linkDependency('babel-plugin-ember-test-metadata', {
      baseDir: __dirname,
    });
  })
  .forEachScenario((scenario) => {
    describe(scenario.name, () => {
      let app;

      beforeAll(async () => {
        app = await scenario.prepare();
      });

      it('runs tests', async () => {
        let result = await app.execute('node ./node_modules/ember-cli/bin/ember test');

        expect(result.output).toMatch('# tests 2');
        expect(result.output).toMatch('# pass  2');
        expect(result.exitCode).toEqual(0);
      });
    });
  });
