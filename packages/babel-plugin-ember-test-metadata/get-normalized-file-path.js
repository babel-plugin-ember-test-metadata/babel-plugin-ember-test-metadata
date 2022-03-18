const {
  _getRelativePathForClassic,
  _getRelativePathForClassicWorkspace,
  _getRelativePathForClassicInRepo,
  _getRelativePathForEmbroider,
  _getRelativePathForEmbroiderInRepo,
} = require('./get-relative-paths');

const path = require('path');

/**
 * Get a normalized file path, based on whether the app build is classic or with Embroider
 * @param {object} opts Babel state.file.opts which include root and filename props
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath({ packageName: projectName, isUsingEmbroider, filename, root, workspaceRoot }) {
  if (!isUsingEmbroider) {
    if (filename.includes('ember-add-in-repo-tests')) {
      return _getRelativePathForClassicInRepo(filename);
    }

    if (workspaceRoot) {
      return _getRelativePathForClassicWorkspace(filename, root, workspaceRoot)
    } else {
      return _getRelativePathForClassic(filename, projectName);
    }
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
