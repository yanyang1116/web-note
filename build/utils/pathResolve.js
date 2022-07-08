const path = require('path');
const fs = require('fs');

/**
 * Make sure any symlinks in the project folder are resolved:
 * https://github.com/facebookincubator/create-react-app/issues/637
 * cwd: 获得当前执行node命令时候的文件夹目录名
 * 命令实际是读取的 package.json，是在根目录下执行的，所以这里就是根目录（app directory）
 */
const appDirectory = fs.realpathSync(process.cwd());

module.exports.appRootPathResolve = (relativePath) =>
	path.resolve(appDirectory, relativePath);

module.exports.relativePathResolve = (relativePath, __dirname) =>
	path.resolve(__dirname, relativePath);
