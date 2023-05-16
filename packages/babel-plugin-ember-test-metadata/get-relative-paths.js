const { basename, join, resolve, sep } = require('path');

function _getNormalizedPackageDir(packageName) {
  const segments = packageName.split('/');
  return segments[segments.length - 1];
}

function _getRelativeProjectPath(pathSegments, projectDir, projectRoot) {
  const appRoot = pathSegments.slice(0, pathSegments.lastIndexOf(projectDir) + 1);
  const projectBaseDir = basename(resolve(appRoot.join(sep), projectRoot));

  return appRoot.slice(appRoot.indexOf(projectBaseDir) + 1).join(sep);
}

function _getRelativePathForClassic(filePath, packageName, projectRoot) {
  const projectDir = _getNormalizedPackageDir(packageName);
  const pathSegments = filePath.split(sep).filter(item => item !== 'dummy')
  const testFilePath = pathSegments
    .splice(pathSegments.lastIndexOf(projectDir) + 1)
    .join(sep);

  if (!projectRoot) {
    return testFilePath;
  }

  if (pathSegments.lastIndexOf(projectDir, -2) > -1) {
    pathSegments.pop();
  }

  const projectPath = _getRelativeProjectPath(pathSegments, projectDir, projectRoot);
  return join(projectPath, testFilePath);
}

function _getRelativePathForClassicInRepo(filePath) {
  const pathSegments = filePath.split(sep);
  return pathSegments
    .slice(pathSegments.indexOf('ember-add-in-repo-tests') + 1)
    .join(sep);
}

function _getRelativePathForEmbroider(filePath, packageName, projectRoot) {
  const pathSegments = filePath.split(sep);
  const testFilePath = pathSegments
    .slice(pathSegments.indexOf('embroider') + 2)
    .join(sep);

  if (!projectRoot) {
    return testFilePath;
  }

  const projectDir = _getNormalizedPackageDir(packageName);
  const projectPath = _getRelativeProjectPath(pathSegments, projectDir, projectRoot);
  const startIndex = projectPath
    ? testFilePath.indexOf(projectPath)
    : testFilePath.indexOf(projectDir) + projectDir.length + 1;

  return testFilePath.slice(startIndex);
}

function _getRelativePathForEmbroiderInRepo(filePath) {
  return _getRelativePathForClassicInRepo(filePath);
}

module.exports = {
  _getRelativePathForClassic,
  _getRelativePathForClassicInRepo,
  _getRelativePathForEmbroider,
  _getRelativePathForEmbroiderInRepo,
};
