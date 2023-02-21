const { join, parse } = require('path');
const { existsSync } = require('fs');
const {
  _getRelativePathForClassic,
  _getRelativePathForClassicInRepo,
  _getRelativePathForEmbroider,
  _getRelativePathForEmbroiderInRepo,
} = require('./get-relative-paths');

/**
 * Get a normalized file path, based on whether the app build is classic or with Embroider
 * @param {Object} opts Babel state.file.opts which include root and filename props
 * @param {string} opts.packageName the name of the package as specified in Babel plugin options
 * @param {boolean} opts.isUsingEmbroider whether building using Embroider as specified in Babel plugin options
 * @param {boolean} opts.getCustomNormalizedFilePath custom function to get normalized file path as specified in Babel plugin options
 * @param {boolean} opts.projectRoot custom relative path to the project's root as specified in Babel plugin options
 * @param {string} opts.filename the absolute perceived path of the file being visited
 * @param {string} opts.root the absolute root project path as seen on disk
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath({ packageName, getCustomNormalizedFilePath, isUsingEmbroider, projectRoot, filename, root }) {
  if (getCustomNormalizedFilePath) {
    if (existsSync(getCustomNormalizedFilePath)) {
      const customNormalizedFilePath = require(getCustomNormalizedFilePath);
      const options = { packageName, isUsingEmbroider, projectRoot, filename, root };

      return customNormalizedFilePath(options);
    } else {
      throw new Error(`The custom normalized file path function specified in your Babel config does not exist at ${getCustomNormalizedFilePath}`);
    }
  } else if (!isUsingEmbroider) {
    if (filename.includes('ember-add-in-repo-tests')) {
      return _getRelativePathForClassicInRepo(filename);
    }

    return _getRelativePathForClassic(filename, packageName, projectRoot);
  } else {
    const { dir, base } = parse(root);
    const rootDirWithBase = join(dir, base);

    if (!projectRoot && filename.includes(rootDirWithBase)) {
      filename = filename.replace(rootDirWithBase, '');
    }

    if (filename.includes('ember-add-in-repo-tests')) {
      return _getRelativePathForEmbroiderInRepo(filename);
    }

    return _getRelativePathForEmbroider(filename, packageName, projectRoot);
  }
}

module.exports = {
  getNormalizedFilePath,
};
