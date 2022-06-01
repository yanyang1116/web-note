'use strict';

const fs = require('fs');
const envArgs = process.argv;

/**
 * 区分 NODE_ENV 和 DELOY_ENV 是有必要的
 * 有时候想生产 debugger，变量环境依赖 NODE_ENV 会比较繁琐，因为 NODE_ENV 是和打包挂钩的
 */
const DEPLOY_ENV = envArgs[envArgs.length - 1];

const { relativePathResolve } = require('../utils/pathResolve');

module.exports = function (obj) {
	// TODO 只是想打印看看
	console.log(obj, 123);
	const { NODE_ENV } = process.env;
	if (!NODE_ENV) {
		throw new Error(
			'The NODE_ENV environment variable is required but was not specified.'
		);
	}

	if (DEPLOY_ENV !== 'dev' && DEPLOY_ENV !== 'prd') {
		throw new Error(
			'The DEPLOY_ENV environment variable is required but was not specified or wrong.'
		);
	}

	// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
	const dotenvFiles = [
		`${relativePathResolve('./')}.${DEPLOY_ENV}`,
		/**
		 * 如果有多人开发，本地增加一个 env 配置会更好，git 提交的时候要 ignore 掉
		 * 这里注意顺序，放在下面能在具体 dotenv 的时候覆盖上面的
		 */
		`${relativePathResolve('./')}.${DEPLOY_ENV}.local`,
	].filter(Boolean);

	// Load environment variables from .env* files. Suppress warnings using silent
	// if this file is missing. dotenv will never modify any environment variables
	// that have already been set.  Variable expansion is supported in .env files.
	// https://github.com/motdotla/dotenv
	// https://github.com/motdotla/dotenv-expand
	dotenvFiles.forEach((dotenvFile) => {
		if (fs.existsSync(dotenvFile)) {
			require('dotenv-expand')(
				require('dotenv').config({
					path: dotenvFile,
				})
			);
		}
	});

	if (obj) {
		const keyArr = Object.keys(obj);
		if (keyArr.length) {
			keyArr.map((item) => {
				if (item && obj[item] !== 'undefined') {
					process.env[item] = obj[item];
				}
			});
		}
	}
};
