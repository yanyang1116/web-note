const fs = require('fs')

const envArgs = process.argv
const len = envArgs.length
const DEPLOY_ENV = envArgs[len - 1]

module.exports = function (obj) {
	if (DEPLOY_ENV !== 'test' && DEPLOY_ENV !== 'pre' && DEPLOY_ENV !== 'prd') {
		throw new Error('The DEPLOY_ENV environment variable is required but was not specified or wrong.')
		process.exit(1)
	}

	// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
	const dotenvFiles = [`${process.cwd()}/config/env/.${DEPLOY_ENV}`].filter(Boolean)

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
			)
		}
	})

	const { NODE_ENV = 'development' } = process.env

	// Do this as the first thing so that any code reading it knows the right env.
	const { BABEL_ENV = NODE_ENV, USE_MP_DIST, PUBLIC_URL } = process.env
	process.env.DEPLOY_ENV = DEPLOY_ENV // Api env
	process.env.NODE_ENV = NODE_ENV // Node env
	process.env.PUBLIC_URL = PUBLIC_URL

	if (obj) {
		const keyArr = Object.keys(obj)
		if (keyArr.length) {
			keyArr.map((item) => {
				if (item && obj[item] !== 'undefined') {
					process.env[item] = obj[item]
				}
			})
		}
	}
}
