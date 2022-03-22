const { getNormalizedFilePath } = require('../get-normalized-file-path');

describe('getNormalizedFilePath', () => {
  describe('classic', () => {
    const appRoot = '/Users/tester/workspace/personal/test-bed/classic';

    it('returns the normalized filepath', () => {
      const filePath =
        '/Users/tester/workspace/personal/test-bed/classic/classic/tests/acceptance/foo-test.js';
      const expectedPath = 'tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: '/Users/tester/workspace/personal/test-bed/classic',
        packageName: 'classic',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath for the in app test', () => {
      const filePath =
        '/Users/tester/workspace/personal/test-bed/classic/classic/tests/acceptance/foo-test.js';
      const expectedPath = 'tests/acceptance/foo-test.js';
      const opts = {
        filename: filePath,
        root: '/Users/tester/workspace/personal/test-bed/classic',
        packageName: 'classic',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with workspaces', () => {
      const filePath =
        '/path/to/workspace/example-web/packages/extended/extended/tests/acceptance/example-test.js';
      const expectedPath = 'tests/acceptance/example-test.js';
      const opts = {
        filename: filePath,
        root: '/path/to/workspace/example-web/packages/extended',
        packageName: 'extended/extended',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with the addon name', () => {
      const filePath = `${appRoot}/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/foo-test.js`;
      const expectedPath = `lib/bar/tests/acceptance/foo-test.js`;
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'classic',
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });
  });

  describe('embroider', () => {
    const appRoot = '/private/var/folders/abcdefg1234/T/embroider/098765';

    it('returns the normalized filepath for app tests', () => {
      const expectedPath = `tests/acceptance/foo-test.js`;
      const filePath = `${appRoot}/tests/acceptance/foo-test.js`;
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'example-app',
        isUsingEmbroider: true,
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath with workspaces', () => {
      debugger;
      const filePath = `${appRoot}/tests/acceptance/example-test.js`;
      const expectedPath = 'tests/acceptance/example-test.js';
      const opts = {
        filename: filePath,
        root: appRoot,
        packageName: 'extended',
        isUsingEmbroider: true,
      };

      const normalizedFilePath = getNormalizedFilePath(opts);

      expect(normalizedFilePath).toEqual(expectedPath);
    });

    it('returns the normalized filepath for addon app tests', () => {
      const filePath = `${appRoot}/tests/acceptance/foo-test.js`;
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
      const filePath = `${appRoot}/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/foo-test.js`;
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
  });
});
