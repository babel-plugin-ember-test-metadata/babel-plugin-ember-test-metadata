const { getNodeProperty, stripEmbroiderPrefix } = require('../src/utils');

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

describe('Unit | utils | stripEmbroiderPrefix', () => {
  const mockEmbroiderBuildPath =
    '/private/var/folders/abcdefg1234/T/embroider/098765/tests/acceptance/my-test.js';

  it('returns stripped file path as expected', () => {
    expect(stripEmbroiderPrefix(mockEmbroiderBuildPath)).toBe(
      'tests/acceptance/my-test.js'
    );
  });
});
