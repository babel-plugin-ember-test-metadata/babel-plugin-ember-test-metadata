const path = require('path');
const {
  getNodeProperty,
  getNormalizedFilePath,
  getParsedClassicFilepath,
  getParsedEmbroiderFilepath,
} = require('../utils');

describe('Unit | utils | getNodeProperty', () => {
  it('returns property as expected', () => {
    const mockNode = {
      system: {
        settings: {
          volume: {
            level: 11,
          },
        },
      },
    };

    expect(getNodeProperty(mockNode, 'system.settings.volume.level')).toBe(11);
    expect(getNodeProperty(mockNode.system.settings, 'volume.level')).toBe(11);
    expect(getNodeProperty(mockNode, 'unknown.leaf.property')).toBe(undefined);
  });

  it('returns early if no node is provided', () => {
    let emptyNode;
    expect(getNodeProperty(emptyNode, 'volume.level')).toBe(undefined);
    expect(getNodeProperty(null, 'volume.level')).toBe(undefined);
    expect(getNodeProperty({}, 'volume.level')).toBe(undefined);
  });
});

describe('Unit | utils | getNormalizedFilePath', () => {
  const fileOpts = {
    embroiderBuildPath: {
      root: '',
      filename: path.join(
        'private',
        'var',
        'folders',
        'abcdefg1234',
        'T',
        'embroider',
        '098765',
        'tests',
        'acceptance',
        'my-test.js'
      ),
    },
    embroiderBuildPathTwoEmbroiderTokens: {
      root: '',
      filename: path.join(
        'private',
        'var',
        'folders',
        'embroider',
        'abcdefg1234',
        'T',
        'embroider',
        '098765',
        'tests',
        'acceptance',
        'my-test.js'
      ),
    },
    normalFilePath: {
      root: '',
      filename: path.join('this', 'is', 'not-an-embroider', 'path'),
    },
  };
  const projectInfo = {
    pkg: {
      name: 'test-app',
      'ember-addon': {},
    },
  };

  it('returns stripped file path as expected', () => {
    expect(getNormalizedFilePath(fileOpts.embroiderBuildPath, projectInfo)).toBe(
      path.join('tests', 'acceptance', 'my-test.js')
    );
    expect(getNormalizedFilePath(fileOpts.embroiderBuildPathTwoEmbroiderTokens, projectInfo)).toBe(
      path.join('tests', 'acceptance', 'my-test.js')
    );
  });

  it('returns unmodified file path when path does not include "embroider" as a segment', () => {
    expect(getNormalizedFilePath(fileOpts.normalFilePath, projectInfo)).toBe(
      path.join('this', 'is', 'not-an-embroider', 'path')
    );
  });
});

describe('Unit | utils | getParsedClassicFilepath', () => {
  const projectInfo = {
    pkg: {
      name: 'test-app',
      'ember-addon': {},
    },
  };
  const tokens = ['test-app', 'tests', 'acceptance', 'my-test.js'];
  const monoRepoProjectInfo = {
    pkg: {
      name: `@parent-repo-name${path.sep}test-app`,
      'ember-addon': {},
    },
  };
  const monoRepoTokens = ['@parent-repo-name', 'test-app', 'tests', 'acceptance', 'my-test.js'];

  it('returns file path from classic build correctly', () => {
    expect(getParsedClassicFilepath(tokens, projectInfo)).toBe(
      path.join('tests', 'acceptance', 'my-test.js')
    );
    expect(getParsedClassicFilepath(monoRepoTokens, monoRepoProjectInfo)).toBe(
      path.join('tests', 'acceptance', 'my-test.js')
    );
  });
});

describe('Unit | utils | getParsedEmbroiderFilepath', () => {
  const filename = path.join(
    'private',
    'var',
    'folders',
    'abcdefg1234',
    'T',
    'embroider',
    '098765',
    'tests',
    'acceptance',
    'my-test.js'
  );
  const tokens = filename.split(path.sep);

  it('returns file path from classic build correctly', () => {
    expect(getParsedEmbroiderFilepath(tokens)).toBe(path.join('tests', 'acceptance', 'my-test.js'));
  });
});
