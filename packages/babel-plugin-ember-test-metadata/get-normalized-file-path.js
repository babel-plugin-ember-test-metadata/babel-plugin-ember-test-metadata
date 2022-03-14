/**
 * Get a normalized file path, based on whether the app build is classic or with Embroider
 * @param {object} opts Babel state.file.opts which include root and filename props
 * @returns {string} E.g. tests/acceptance/my-test.js
 */
function getNormalizedFilePath({ packageName, filename, isUsingEmbroider, root, sourceFileName }) {
  let file = sourceFileName || filename;

  if (file.includes(root)) {
    const regex = new RegExp(`.*${root}/`);
    file = file.replace(regex, '');
  }

  if (file.startsWith(`${packageName}/`)) {
    const regex = new RegExp(`^${packageName}/`);
    file = file.replace(regex, '');
  }

  if (isUsingEmbroider) {
    const regex = new RegExp(`^.*embroider/.{6}/`);
    file = file.replace(regex, '');
  }

  if (file.includes('ember-add-in-repo-tests')) {
    const regex = new RegExp(`^.*ember-add-in-repo-tests/`);
    file = file.replace(regex, '');
  }

  return file;
}

module.exports = {
  getNormalizedFilePath,
};
