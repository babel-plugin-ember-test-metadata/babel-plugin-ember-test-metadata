const {
  _getRelativePathForClassic,
  _getRelativePathForClassicWorkspace,
  _getRelativePathForClassicInRepo,
  _getRelativePathForEmbroider,
  _getRelativePathForEmbroiderInRepo,
} = require('../get-relative-paths');

describe('get-relative-paths', () => {
  it('returns relative paths with the workspace prefix for classic projects', () => {
    const testCases = [
      {
        filePath: '/Users/tester/workspace/classic/packages/extended/extended/tests/acceptance/foo-test.js',
        expected: 'packages/extended/tests/acceptance/foo-test.js',
      }
    ];

    testCases.forEach(({ filePath, expected }) => {
      expect(_getRelativePathForClassicWorkspace(filePath, 'extended', 'packages')).toEqual(expected);
    });
  });

  it('can return relative paths for classic projects', () => {
    const testCases = [
      {
        filePath: '/Users/tester/workspace/classic/classic/tests/acceptance/foo-test.js',
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/workspace/classic/classic/tests/acceptance/subdir/foo-test.js',
        expected: 'tests/acceptance/subdir/foo-test.js',
      },
      {
        filePath:
          '/Users/tester/workspace/classic/classic/tests/acceptance/subdir/subdir/foo-test.js',
        expected: 'tests/acceptance/subdir/subdir/foo-test.js',
      },
      {
        filePath: '/Users/tester/workspace/foo/classic/tests/acceptance/subdir/subdir/foo-test.js',
        expected: 'tests/acceptance/subdir/subdir/foo-test.js',
      },
    ];

    testCases.forEach(({ filePath, expected }) => {
      expect(_getRelativePathForClassic(filePath, 'classic')).toEqual(expected);
    });
  });

  it('can return relative paths for classic projects with in-repo paths', () => {
    const testCases = [
      {
        filePath:
          '/Users/tester/workspace/classic/classic/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/baz-test.js',
        expected: 'lib/bar/tests/acceptance/baz-test.js',
      },
      {
        filePath:
          '/Users/tester/workspace/classic/classic/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/subdir/baz-test.js',
        expected: 'lib/bar/tests/acceptance/subdir/baz-test.js',
      },
      {
        filePath:
          '/Users/tester/workspace/classic/classic/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/subdir/subdir/baz-test.js',
        expected: 'lib/bar/tests/acceptance/subdir/subdir/baz-test.js',
      },
      {
        filePath:
          '/Users/tester/workspace/foo/classic/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/subdir/subdir/baz-test.js',
        expected: 'lib/bar/tests/acceptance/subdir/subdir/baz-test.js',
      },
    ];

    testCases.forEach(({ filePath, expected }) => {
      expect(_getRelativePathForClassicInRepo(filePath, 'classic', [])).toEqual(expected);
    });
  });

  it('can return relative paths for embroider projects', () => {
    const testCases = [
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/tests/acceptance/foo-test.js',
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/tests/acceptance/subdir/foo-test.js',
        expected: 'tests/acceptance/subdir/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/tests/acceptance/subdir/subdir/foo-test.js',
        expected: 'tests/acceptance/subdir/subdir/foo-test.js',
      },
    ];

    testCases.forEach(({ filePath, expected }) => {
      expect(_getRelativePathForEmbroider(filePath)).toEqual(expected);
    });
  });

  it('can return relative paths for embroider projects with in-repo paths', () => {
    const testCases = [
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/baz-test.js',
        expected: 'lib/bar/tests/acceptance/baz-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/subdir/baz-test.js',
        expected: 'lib/bar/tests/acceptance/subdir/baz-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/tests/ember-add-in-repo-tests/lib/bar/tests/acceptance/subdir/subdir/baz-test.js',
        expected: 'lib/bar/tests/acceptance/subdir/subdir/baz-test.js',
      },
    ];

    testCases.forEach(({ filePath, expected }) => {
      expect(_getRelativePathForEmbroiderInRepo(filePath, 'classic', [])).toEqual(expected);
    });
  });
});
