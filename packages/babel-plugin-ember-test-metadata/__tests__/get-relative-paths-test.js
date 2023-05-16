const {
  _getRelativePathForClassic,
  _getRelativePathForClassicInRepo,
  _getRelativePathForEmbroider,
  _getRelativePathForEmbroiderInRepo,
} = require('../get-relative-paths');

describe('get-relative-paths', () => {
  it('can return relative paths for classic projects', () => {
    const testCases = [
      {
        filePath: '/Users/tester/workspace/classic/classic/tests/acceptance/foo-test.js',
        packageName: 'classic',
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/workspace/classic/classic/tests/acceptance/subdir/foo-test.js',
        packageName: 'classic',
        expected: 'tests/acceptance/subdir/foo-test.js',
      },
      {
        filePath:
          '/Users/tester/workspace/classic/classic/tests/acceptance/subdir/subdir/foo-test.js',
        packageName: 'classic',
        expected: 'tests/acceptance/subdir/subdir/foo-test.js',
      },
      {
        filePath: '/Users/tester/workspace/foo/classic/tests/acceptance/subdir/subdir/foo-test.js',
        packageName: 'classic',
        expected: 'tests/acceptance/subdir/subdir/foo-test.js',
      },
      {
        filePath: '/Users/tester/workspace/foo/classic/@scoped/classic/tests/acceptance/foo-test.js',
        packageName: '@scoped/classic',
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/workspace/foo/classic/classic/dummy/tests/acceptance/subdir/foo-test.js',
        packageName: 'classic',
        expected: 'tests/acceptance/subdir/foo-test.js',
      },
    ];

    testCases.forEach(({ filePath, packageName, expected }) => {
      expect(_getRelativePathForClassic(filePath, packageName)).toEqual(expected);
    });
  });

  it('can return relative paths for classic projects with workspaces', () => {
    const testCases = [
      {
        filePath: '/Users/tester/projects/classic-in-workspace/packages/classic/classic/tests/acceptance/foo-test.js',
        packageName: 'classic',
        projectRoot: '../..',
        expected: 'packages/classic/tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-in-workspace/packages/classic/classic/tests/acceptance/subdir/foo-test.js',
        packageName: 'classic',
        projectRoot: '../..',
        expected: 'packages/classic/tests/acceptance/subdir/foo-test.js',
      },
      {
        filePath:
          '/Users/tester/projects/classic-in-workspace/packages/classic/classic/tests/acceptance/subdir/subdir/foo-test.js',
        packageName: 'classic',
        projectRoot: '../..',
        expected: 'packages/classic/tests/acceptance/subdir/subdir/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/foo/classic-in-workspace/packages/classic/tests/acceptance/subdir/subdir/foo-test.js',
        packageName: 'classic',
        projectRoot: '../..',
        expected: 'packages/classic/tests/acceptance/subdir/subdir/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/foo/classic-in-workspace/packages/classic/@scoped/classic/tests/acceptance/foo-test.js',
        packageName: '@scoped/classic',
        projectRoot: '../..',
        expected: 'packages/classic/tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-in-workspace/packages/classic/classic/tests/acceptance/foo-test.js',
        packageName: 'classic',
        projectRoot: undefined,
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-in-workspace/packages/classic/classic/tests/acceptance/foo-test.js',
        packageName: 'classic',
        projectRoot: '.',
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-in-workspace/packages/classic/classic/tests/acceptance/foo-test.js',
        packageName: 'classic',
        projectRoot: '..',
        expected: 'classic/tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-in-workspace/foo/packages/classic/classic/tests/acceptance/foo-test.js',
        packageName: 'classic',
        projectRoot: '../../..',
        expected: 'foo/packages/classic/tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-web/packages/classic-web/classic-web/tests/acceptance/foo-test.js',
        packageName: 'classic-web',
        projectRoot: '../..',
        expected: 'packages/classic-web/tests/acceptance/foo-test.js',
      },
      {
        filePath: '/Users/tester/projects/classic-web/packages/classic-web/@scoped/classic-web/tests/acceptance/foo-test.js',
        packageName: 'classic-web',
        projectRoot: '../..',
        expected: 'packages/classic-web/tests/acceptance/foo-test.js',
      },
    ];

    testCases.forEach(({ filePath, packageName, projectRoot, expected }) => {
      expect(_getRelativePathForClassic(filePath, packageName, projectRoot)).toEqual(expected);
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
      expect(_getRelativePathForClassicInRepo(filePath)).toEqual(expected);
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

  it('can return relative paths for embroider projects with workspaces', () => {
    const testCases = [
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: '../..',
        expected: 'packages/example-app/tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/subdir/foo-test.js',
        packageName: 'example-app',
        projectRoot: '../..',
        expected: 'packages/example-app/tests/acceptance/subdir/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/subdir/subdir/foo-test.js',
        packageName: 'example-app',
        projectRoot: '../..',
        expected: 'packages/example-app/tests/acceptance/subdir/subdir/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/foo-test.js',
        packageName: '@scoped/example-app',
        projectRoot: '../..',
        expected: 'packages/example-app/tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: undefined,
        expected: 'packages/example-app/tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: '.',
        expected: 'tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: '..',
        expected: 'example-app/tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/foo/bar/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: '../..',
        expected: 'packages/example-app/tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/foo/bar/baz/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: '../../../..',
        expected: 'bar/baz/packages/example-app/tests/acceptance/foo-test.js',
      },
      {
        filePath:
          '/private/var/folders/24/v9y37q75019cv62vg5ms10tw001llm/T/embroider/620a67/foo/example-app/packages/example-app/tests/acceptance/foo-test.js',
        packageName: 'example-app',
        projectRoot: '../..',
        expected: 'packages/example-app/tests/acceptance/foo-test.js',
      },
    ];

    testCases.forEach(({ filePath, packageName, projectRoot, expected }) => {
      expect(_getRelativePathForEmbroider(filePath, packageName, projectRoot)).toEqual(expected);
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
      expect(_getRelativePathForEmbroiderInRepo(filePath)).toEqual(expected);
    });
  });
});
