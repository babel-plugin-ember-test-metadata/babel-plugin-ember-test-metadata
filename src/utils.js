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

/**
 * Check if the file path follows an Embroider build pattern
 * @param {string} filepath
 * @returns boolean
 */
function hasEmbroiderPrefix(filepath) {
  if (typeof filepath !== 'string') return;

  const separator = filepath.includes('\\') ? '\\' : '/';
  return filepath.split(separator).includes('embroider');
}

/**
 * Get a file path with the Embroider prefix segments stripped out
 * @param {string} filepath  E.g. /private/var/folders/abcdefg1234/T/embroider/098765/tests/acceptance/my-test.js
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getEmbroiderStrippedPrefixPath(filepath) {
  if (typeof filepath !== 'string') return;

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
