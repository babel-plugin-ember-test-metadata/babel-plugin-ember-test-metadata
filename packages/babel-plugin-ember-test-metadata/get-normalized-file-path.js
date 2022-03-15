const {
  _getRelativePathForClassic,
  _getRelativePathForClassicInRepo,
  _getRelativePathForEmbroider,
  _getRelativePathForEmbroiderInRepo,
} = require('./get-relative-paths');

const path = require('path');

/**
 * Get a normalized file path, based on whether the app build is classic or with Embroider
 * @param {Object} opts Babel state.file.opts which include root and filename props
 * @param {string} opts.packageName the name of the package specified in babel plugin options
 * @param {boolean} opts.isUsingEmbroider flag for embroider builds as specified in babel plugin options
 * @param {string} opts.filename absolute path the name of the file being visited
 * @param {string} opts.root path to the project root (defaults to cwd)
 * @param {string} opts.sourceFileName path.basename(opts.filenameRelative) when available, or "unknown"
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath({ packageName, isUsingEmbroider, filename, root, sourceFileName }) {
  if (!isUsingEmbroider) {
    if (filename.includes('ember-add-in-repo-tests')) {
      return _getRelativePathForClassicInRepo(filename);
    }

    if (sourceFileName &&
      !path.isAbsolute(sourceFileName) &&
      !sourceFileName.startsWith(packageName) &&
      sourceFileName !== 'unknown') {
      return sourceFileName;
    }

    return _getRelativePathForClassic(filename, packageName);
  } else {
    const rootDirWithBase = path.join(path.parse(root).dir, path.parse(root).base);
    if (filename.includes(rootDirWithBase)) {
      filename = filename.replace(rootDirWithBase, '');
    }

    if (filename.includes('ember-add-in-repo-tests')) {
      return _getRelativePathForEmbroiderInRepo(filename);
    }

    return _getRelativePathForEmbroider(filename);
  }
}

module.exports = {
  getNormalizedFilePath,
};
