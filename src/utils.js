/**
 * Utility to get a property from a given path
 * @param {object} node
 * @param {string} path
 * @returns property value
 */
function getNodeProperty(node, path) {
  if (!node) {
    return;
  }

  let parts;
  if (typeof path === 'string') {
    parts = path.split('.');
  } else {
    parts = path;
  }

  if (parts.length === 1) {
    return node[path];
  }

  let property = node[parts[0]];

  if (property && parts.length > 1) {
    parts.shift();
    return getNodeProperty(property, parts);
  }

  return property;
}

function hasEmbroiderPrefix(filepath) {
  if (typeof filepath !== 'string') return;

  const separator = filepath.includes('\\') ? '\\' : '/';
  return filepath.split(separator).includes('embroider');
}

function getEmbroiderStrippedPrefixPath(filepath) {
  if (!hasEmbroiderPrefix(filepath)) return;

  const separator = filepath.includes('\\') ? '\\' : '/';
  const tokens = filepath.split(separator);

  tokens.splice(0, tokens.indexOf('embroider') + 2);
  return tokens.join(separator);
}

module.exports = {
  getNodeProperty,
  getEmbroiderStrippedPrefixPath,
  hasEmbroiderPrefix,
};
