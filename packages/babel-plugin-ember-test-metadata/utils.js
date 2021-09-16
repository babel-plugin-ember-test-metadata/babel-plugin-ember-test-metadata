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
 * Function to parse defaults.project and only return info to be used by the plugin
 * @param {object} project Ember defaults.project
 * @param {string} project.pkg - The package of the parent project.
 * @param {string} project.pkg.name - The name of the parent project.
 * @param {object} project.pkg['ember-addon'] - Ember-addon info.
 * @param {array} project.pkg['ember-addon'].paths - Ember-addon path strings.
 * @returns {object} Contains project name and ember-addon path info
 */
function getProjectConfiguration(project) {
  const parsedProjectConfiguration = {};

  if (project) {
    parsedProjectConfiguration.pkg = {
      name: project.pkg.name,
      'ember-addon': {
        paths: project.pkg['ember-addon'].paths,
      },
    };
  }

  return parsedProjectConfiguration;
}

function _getParsedClassicFilepath(pathSegments, projectConfiguration) {
  const projectNamePathSeparators = projectConfiguration.pkg.name.split(path.sep);

  pathSegments.splice(
    0,
    pathSegments.indexOf(projectNamePathSeparators[0]) + projectNamePathSeparators.length
  );

  return pathSegments.join(path.sep);
}

function _getParsedEmbroiderFilepath(pathSegments) {
  const RELATIVE_PATH_ROOT = 2;

  // A typical Embroider pathSegments array would look something like:
  // ['private', 'var', 'some-hash', 'embroider', 'another-hash', 'tests', 'acceptance', ...]
  // This strips everything from the first segment up to and including 'another-hash',
  pathSegments.splice(0, pathSegments.lastIndexOf('embroider') + RELATIVE_PATH_ROOT);

  return pathSegments.join(path.sep);
}

/**
 * Get a normalized file path, based on whether the app build is classic or with Embroider
 * @param {object} fileOpts Babel state.file.opts which include root and filename props
 * @param {object} projectConfiguration Contains project name, ember-addon path info
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath(fileOpts, projectConfiguration) {
  let { root, filename } = fileOpts;
  const pathSegments = filename.split(path.sep);
  const isEmbroider = pathSegments.includes('embroider');

    filename = isEmbroider ? _getParsedEmbroiderFilepath(pathSegments) : _getParsedClassicFilepath(pathSegments, projectConfiguration);

  return path.relative(root, filename);
}

module.exports = {
  getNodeProperty,
  getNormalizedFilePath,
  getProjectConfiguration,
  _getParsedClassicFilepath,
  _getParsedEmbroiderFilepath,
};
