const path = require('path');
const { getNodeProperty, getNormalizedFilePath } = require('../src/utils');

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
  const embroiderBuildPath =
    '/private/var/folders/abcdefg1234/T/embroider/098765/tests/acceptance/my-test.js';
  const embroiderBuildPathTwoEmbroiderTokens =
    '/private/var/folders/embroider/abcdefg1234/T/embroider/098765/tests/acceptance/my-test.js';

  it('returns stripped file path as expected', () => {
    expect(
      getNormalizedFilePath({ root: '', filename: embroiderBuildPath })
    ).toBe('tests/acceptance/my-test.js');
    expect(
      getNormalizedFilePath({
        root: '',
        filename: embroiderBuildPathTwoEmbroiderTokens,
      })
    ).toBe('tests/acceptance/my-test.js');
  });

  it('returns unmodified file path when path does not include "embroider" as a segment', () => {
    expect(
      getNormalizedFilePath({
        root: '',
        filename: 'this/is/not-an-embroider/path',
      })
    ).toBe('this/is/not-an-embroider/path');
  });
});

describe('Unit | utils | getNormalizedFilePath with Windows path', () => {
  const originalPathSeperator = path.sep;
  const windowsEmbroiderBuildPath =
    'C:\\private\\var\\folders\\abcdefg1234\\T\\embroider\\098765\\tests\\acceptance\\my-test.js';

  beforeEach(() => {
    path.sep = '\\';
  });

  afterEach(() => {
    path.sep = originalPathSeperator;
  });

  it('returns stripped file path as expected', () => {
    expect(
      getNormalizedFilePath({ root: '', filename: windowsEmbroiderBuildPath })
    ).toBe('tests\\acceptance\\my-test.js');
  });
});
