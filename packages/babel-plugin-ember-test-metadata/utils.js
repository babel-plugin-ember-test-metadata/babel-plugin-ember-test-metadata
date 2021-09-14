const path = require('path');
const EMBROIDER = 'embroider';

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

function getProjectInfo(project) {
  const parsedProjectInfo = {};

  if (project) {
    parsedProjectInfo.pkg = {
      name: project.pkg.name,
      'ember-addon': {
        paths: project.pkg['ember-addon'].paths,
      },
    };
  }

  return parsedProjectInfo;
}

/**
 * Strip out project name prefix segement(s) from file path
 * @param {array} tokens File path segments
 * @param {object} projectInfo Contains project name, ember-addon path info
 * @returns {string} A joined file path, e.g. tests/acceptance/my-test.js
 */
function getParsedClassicFilepath(tokens, projectInfo) {
  const projectNameTokens = projectInfo.pkg.name.split(path.sep);

  tokens.splice(0, tokens.indexOf(projectNameTokens[0]) + projectNameTokens.length);

  return tokens.join(path.sep);
}

/**
 * Strip out Embroider prefix (embroider/nnnnnn) segements from file path
 * @param {array} tokens File path segments
 * @returns {string} A joined file path, e.g. tests/acceptance/my-test.js
 */
function getParsedEmbroiderFilepath(tokens) {
  const RELATIVE_PATH_ROOT = 2;

  tokens.splice(0, tokens.lastIndexOf(EMBROIDER) + RELATIVE_PATH_ROOT);

  return tokens.join(path.sep);
}

/**
 * Get a normalized file path, based on whether the app build is classic or with Embroider
 * @param {object} fileOpts Babel state.file.opts which include root and filename props
 * @param {object} projectInfo Contains project name, ember-addon path info
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath(fileOpts, projectInfo) {
  let { root, filename } = fileOpts;
  const tokens = filename.split(path.sep);
  const isEmbroider = tokens.includes(EMBROIDER);

  if (isEmbroider) {
    filename = getParsedEmbroiderFilepath(tokens);
  } else {
    filename = getParsedClassicFilepath(tokens, projectInfo);
  }

  return path.relative(root, filename);
}

module.exports = {
  getNodeProperty,
  getNormalizedFilePath,
  getProjectInfo,
};
