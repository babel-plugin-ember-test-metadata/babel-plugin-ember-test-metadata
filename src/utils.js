const path = require('path');

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
 * Get a normalized file path. If Embroider prefix is present, strip it out
 * @param {object} fileOpts Babel state.file.opts which include root and filename props
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath(fileOpts) {
  let { root, filename } = fileOpts;
  const tokens = filename.split(path.sep);
  const EMBROIDER = 'embroider';

  if (tokens.includes(EMBROIDER)) {
    const RELATIVE_PATH_ROOT = 2;

    tokens.splice(0, tokens.lastIndexOf(EMBROIDER) + RELATIVE_PATH_ROOT);
  }
  filename = tokens.join(path.sep);

  return path.relative(root, filename);
}

module.exports = {
  getNodeProperty,
  getNormalizedFilePath,
};
