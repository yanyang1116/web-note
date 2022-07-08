// 'use strict';

// // Makes the script crash on unhandled rejections instead of silently
// // ignoring them. In the future, promise rejections that are not handled will
// // terminate the Node.js process with a non-zero exit code.
// process.on('unhandledRejection', (err) => {
// 	throw err;
// });

// const path = require('path');
// const chalk = require('react-dev-utils/chalk');
// const fs = require('fs-extra');
// const webpack = require('webpack');
// const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
// const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
// const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
// const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
// const printBuildError = require('react-dev-utils/printBuildError');

// const { appRootPathResolve } = require('./utils/pathResolve');

// const measureFileSizesBeforeBuild =
// 	FileSizeReporter.measureFileSizesBeforeBuild;
// const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
// const useYarn = fs.existsSync(appRootPathResolve('./yarn.lock'));

// // These sizes are pretty large. We'll warn for bundles exceeding them.
// const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
// const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// const isInteractive = process.stdout.isTTY;

// // Warn and crash if required files are missing
// if (
// 	!checkRequiredFiles([
// 		appRootPathResolve('./index.html'),
// 		appRootPathResolve('./src/index.js'),
// 	])
// ) {
// 	process.exit(1);
// }

// const config = require('./webpack.base.config');

// // We require that you explicitly set browsers and do not fall back to
// // browserslist defaults.
// const { checkBrowsers } = require('react-dev-utils/browsersHelper');
// checkBrowsers(appRootPathResolve('./'), isInteractive)
// 	.then(() => {
// 		/**
// 		 * 测一下目前文件夹打包的大小，返回给下一个 promise
// 		 * 以便让你能比较打包的变化
// 		 */
// 		return measureFileSizesBeforeBuild(appRootPathResolve('./dist'));
// 	})
// 	.then((previousFileSizes) => {
// 		// Remove all content but keep the directory so that
// 		// if you're in it, you don't end up in Trash —— fs-extra 这个功能感觉不错
// 		fs.emptyDirSync(appRootPathResolve('./dist'));

// 		// 有些文件可能需要移动，目前这个函数内容为空
// 		copyPublicFolder();

// 		// 核心构建函数
// 		return build(previousFileSizes);
// 	})
// 	.then(
// 		({ stats, previousFileSizes, warnings }) => {
// 			if (warnings.length) {
// 				console.log(chalk.yellow('Compiled with warnings.\n'));
// 				console.log(warnings.join('\n\n'));
// 				console.log(
// 					'\nSearch for the ' +
// 						chalk.underline(chalk.yellow('keywords')) +
// 						' to learn more about each warning.'
// 				);
// 				console.log(
// 					'To ignore, add ' +
// 						chalk.cyan('// eslint-disable-next-line') +
// 						' to the line before.\n'
// 				);
// 			} else {
// 				console.log(chalk.green('Compiled successfully.\n'));
// 			}

// 			console.log('File sizes after gzip:\n');
// 			printFileSizesAfterBuild(
// 				stats,
// 				previousFileSizes,
// 				appRootPathResolve('./dist'),
// 				WARN_AFTER_BUNDLE_GZIP_SIZE,
// 				WARN_AFTER_CHUNK_GZIP_SIZE
// 			);
// 			console.log();

// 			const appPackage = require(appRootPathResolve('./package.json'));
// 			const publicUrl = process.env.PUBLIC_URL;
// 			const publicPath = process.env.PUBLIC_URL;
// 			const buildFolder = path.relative(
// 				process.cwd(),
// 				appRootPathResolve('./dist')
// 			);
// 			printHostingInstructions(
// 				appPackage,
// 				publicUrl,
// 				publicPath,
// 				buildFolder,
// 				useYarn
// 			);
// 		},
// 		(err) => {
// 			const tscCompileOnError =
// 				process.env.TSC_COMPILE_ON_ERROR === 'true';
// 			if (tscCompileOnError) {
// 				console.log(
// 					chalk.yellow(
// 						'Compiled with the following type errors (you may want to check these before deploying your app):\n'
// 					)
// 				);
// 				printBuildError(err);
// 			} else {
// 				console.log(chalk.red('Failed to compile.\n'));
// 				printBuildError(err);
// 				process.exit(1);
// 			}
// 		}
// 	)
// 	.catch((err) => {
// 		if (err && err.message) {
// 			console.log(err.message);
// 		}
// 		process.exit(1);
// 	});

// // Create the production build and print the deployment instructions.
// function build(previousFileSizes) {
// 	console.log('Creating an optimized production build...');

// 	const compiler = webpack(config);
// 	return new Promise((resolve, reject) => {
// 		compiler.run((err, stats) => {
// 			let messages;
// 			if (err) {
// 				if (!err.message) {
// 					return reject(err);
// 				}

// 				let errMessage = err.message;

// 				// Add additional information for postcss errors
// 				if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
// 					errMessage +=
// 						'\nCompileError: Begins at CSS selector ' +
// 						err['postcssNode'].selector;
// 				}

// 				messages = formatWebpackMessages({
// 					errors: [errMessage],
// 					warnings: [],
// 				});
// 			} else {
// 				messages = formatWebpackMessages(
// 					stats.toJson({ all: false, warnings: true, errors: true })
// 				);
// 			}
// 			if (messages.errors.length) {
// 				// Only keep the first error. Others are often indicative
// 				// of the same problem, but confuse the reader with noise.
// 				if (messages.errors.length > 1) {
// 					messages.errors.length = 1;
// 				}
// 				return reject(new Error(messages.errors.join('\n\n')));
// 			}
// 			if (
// 				process.env.CI &&
// 				(typeof process.env.CI !== 'string' ||
// 					process.env.CI.toLowerCase() !== 'false') &&
// 				messages.warnings.length
// 			) {
// 				// Ignore sourcemap warnings in CI builds. See #8227 for more info.
// 				const filteredWarnings = messages.warnings.filter(
// 					(w) => !/Failed to parse source map/.test(w)
// 				);
// 				if (filteredWarnings.length) {
// 					console.log(
// 						chalk.yellow(
// 							'\nTreating warnings as errors because process.env.CI = true.\n' +
// 								'Most CI servers set it automatically.\n'
// 						)
// 					);
// 					return reject(new Error(filteredWarnings.join('\n\n')));
// 				}
// 			}

// 			const resolveArgs = {
// 				stats,
// 				previousFileSizes,
// 				warnings: messages.warnings,
// 			};

// 			return resolve(resolveArgs);
// 		});
// 	});
// }

// function copyPublicFolder() {}
