const { join, sep } = require('path');

module.exports = function normalizeBuildIsolationPath(options) {
    const pathSegments = options.filename.split(sep);
    const testFilePath = pathSegments
      .slice(pathSegments.indexOf('tests'))
      .join(sep);

    const projectPath = pathSegments.slice(pathSegments.indexOf(options.packageName) + 1, pathSegments.indexOf('tests') - 1).join(sep);

    return join(projectPath, testFilePath);
}
