const { basename, join, resolve, sep } = require('path');
const { getNormalizedFilePath } = require('../get-normalized-file-path');

describe('getNormalizedFilePath', () => {
  describe('classic', () => {
    const appRoot = '/Users/tester/workspace/personal/test-bed/classic';

    it('returns the normalized filepath', () => {
      const filePath = `${appRoot}/classic/tests/acceptance/foo-test.js`;
      const expectedPath = 'tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'classic',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath for the in app test', () => {
      const filePath = `${appRoot}/classic/tests/acceptance/foo-test.js`;
      const expectedPath = 'tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'classic',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with the addon name', () => {
      const filePath = `${appRoot}/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/foo-test.js`;
      const expectedPath = 'lib/bar/tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'classic',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath for the in app test with workspaces', () => {
      const filePath = `${appRoot}/packages/example-app/example-app/tests/acceptance/foo-test.js`;
      const expectedPath = 'packages/example-app/tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: `${appRoot}/packages/example-app`,
        packageName: 'example-app',
        projectRoot: '../..',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with the addon name for workspaces', () => {
      const filePath = `${appRoot}/packages/example-app/example-app/tests/ember-add-in-repo-tests/packages/addons/bar/tests/acceptance/foo-test.js`;
      const expectedPath = 'packages/addons/bar/tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: `${appRoot}/packages/example-app`,
        packageName: 'example-app',
        projectRoot: '../..',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });
  });

  describe('embroider', () => {
    const appRoot = '/Users/tester/workspace/personal/test-bed/example-app';
    const embroiderRoot = '/private/var/folders/abcdefg1234/T/embroider/098765';

    it('returns the normalized filepath for app tests', () => {
      const expectedPath = `tests/acceptance/foo-test.js`;
      const filePath = `${embroiderRoot}/tests/acceptance/foo-test.js`;
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'example-app',
        isUsingEmbroider: true,
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath for addon app tests', () => {
      const filePath = `${embroiderRoot}/tests/acceptance/foo-test.js`;
      const expectedPath = `tests/acceptance/foo-test.js`;
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'example-app',
        isUsingEmbroider: true,
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with the addon name for addon tests', () => {
      const filePath = `${embroiderRoot}/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/foo-test.js`;
      const expectedPath = `lib/bar/tests/acceptance/foo-test.js`;
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'example-app',
        isUsingEmbroider: true,
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath for app tests with workspaces', () => {
      const filePath = `${embroiderRoot}/packages/foo/tests/acceptance/foo-test.js`;
      const expectedPath = 'packages/foo/tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: `${appRoot}/packages/foo`,
        packageName: 'foo',
        isUsingEmbroider: true,
        projectRoot: '../..'
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with the addon name with workspaces', () => {
      const filePath = `${embroiderRoot}/packages/foo/tests/ember-add-in-repo-tests/packages/addons/bar/tests/acceptance/foo-test.js`;
      const expectedPath = 'packages/addons/bar/tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: `${appRoot}/packages/foo`,
        packageName: 'foo',
        isUsingEmbroider: true,
        projectRoot: '../..'
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });
  });

  describe('custom normalized filePath function', () => {
    const appRoot = '/Users/tester/workspace/personal/test-bed/example-app';

    function normalizeBuildIsolationPath(filePath, packageName, projectRoot) {
        const pathSegments = filePath.split(sep);
        const testFilePath = pathSegments
          .slice(pathSegments.indexOf('tests'))
          .join(sep);
      
        if (!projectRoot) {
          return testFilePath;
        }

        const addonRoot = pathSegments.slice(0, pathSegments.lastIndexOf(packageName));
        const projectBaseDir = basename(resolve(addonRoot.join(sep), projectRoot));
        const projectPath = addonRoot.slice(addonRoot.indexOf(projectBaseDir) + 1).join(sep);
        
        return join(projectPath, testFilePath);
      }

    it('returns the normalized filepath for build isolation addon test', () => {
      const filePath = `${appRoot}/packages/addons/example-addon/example-app/tests/acceptance/foo-test.js`;
      const expectedPath = 'packages/addons/example-addon/tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'example-app',
        projectRoot: '../../..',
        getCustomNormalizedFilePath: normalizeBuildIsolationPath,
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });
  });
});
