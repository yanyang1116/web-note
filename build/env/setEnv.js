'use strict';

const fs = require('fs');
const envArgs = process.argv;

const dotenvExpand = require('dotenv-expand');
const dotenv = require('dotenv');

/**
 * 区分 NODE_ENV 和 DELOY_ENV 是有必要的
 * 具体就不举例子了，总之会有用到这两个变量的场景
 */
let DEPLOY_ENV = envArgs[envArgs.length - 1];
DEPLOY_ENV = DEPLOY_ENV.replace('--', ''); // 参数这里以 -- 传递，这里要处理下

const { relativePathResolve } = require('../utils/pathResolve');

module.exports = function () {
	const { NODE_ENV } = process.env;
	if (!NODE_ENV) {
		throw new Error(
			'The NODE_ENV environment variable is required but was not specified.'
		);
	}

	if (!['dev', 'prd', 'test'].includes(DEPLOY_ENV)) {
		throw new Error(
			'The DEPLOY_ENV environment variable is required but was not specified or wrong.'
		);
	}

	// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
	const dotenvFiles = [
		`${relativePathResolve('./', __dirname)}/.${DEPLOY_ENV}`,
		/**
		 * 如果有多人开发，本地增加一个 env 配置会更好，git 提交的时候要 ignore 掉
		 * 这里注意顺序，放在下面能在具体 dotenv 的时候覆盖上面的
		 */
		`${relativePathResolve('./', __dirname)}/.${DEPLOY_ENV}.local`,
	].filter((item) => fs.existsSync(item));

	// Load environment variables from .env* files. Suppress warnings using silent
	// if this file is missing. dotenv will never modify any environment variables
	// that have already been set.  Variable expansion is supported in .env files.
	// https://github.com/motdotla/dotenv
	// https://github.com/motdotla/dotenv-expand
	dotenvFiles.forEach((dotenvFile) => {
		dotenvExpand.expand(
			dotenv.config({
				path: dotenvFile,
			})
		);
	});
};
