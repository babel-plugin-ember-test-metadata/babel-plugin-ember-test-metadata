const {
  getNodeProperty,
  getEmbroiderStrippedPrefixPath,
  hasEmbroiderPrefix,
} = require('../src/utils');

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

describe('Unit | utils | getEmbroiderStrippedPrefixPath', () => {
  const mockEmbroiderBuildPath =
    '/private/var/folders/abcdefg1234/T/embroider/098765/tests/acceptance/my-test.js';
  const mockWindowsEmbroiderBuildPath =
    'C:\\private\\var\\folders\\abcdefg1234\\T\\embroider\\098765\\tests\\acceptance\\my-test.js';

  it('returns stripped file path as expected', () => {
    expect(getEmbroiderStrippedPrefixPath(mockEmbroiderBuildPath)).toBe(
      'tests/acceptance/my-test.js'
    );
    expect(getEmbroiderStrippedPrefixPath(mockWindowsEmbroiderBuildPath)).toBe(
      'tests\\acceptance\\my-test.js'
    );
  });

  it('returns undefined if file path is not a string', () => {
    expect(getEmbroiderStrippedPrefixPath({})).toBe(undefined);
  });
});

describe('Unit | utils | hasEmbroiderPrefix', () => {
  const mockEmbroiderBuildPath =
    '/private/var/folders/abcdefg1234/T/embroider/098765/tests/acceptance/my-test.js';

  it('returns true if file path includes "embroider"', () => {
    expect(hasEmbroiderPrefix(mockEmbroiderBuildPath)).toBe(true);
  });

  it('returns false if file path does not include "embroider"', () => {
    expect(hasEmbroiderPrefix('this/is/not-an-embroider/path')).toBe(false);
  });

  it('returns undefined if file path is not a string', () => {
    expect(hasEmbroiderPrefix({})).toBe(undefined);
  });
});
