/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// 设置环境及打印相关日志
require('./setEnv')()
require('./envLog')()

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them. In the future, promise rejections that are not handled will
 * terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', (err) => {
	throw err
})

const fs = require('fs')
const chalk = require('chalk')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const { choosePort, createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')

const paths = require('../config/paths')
const baseWebpackConfig = require('./webpack.base.config')
const createDevServerConfig = require('./webpack.devServer.config')

const useYarn = fs.existsSync(paths.rootYarnLockFile)

// 检测 stdout 是否正在传递
const isInteractive = process.stdout.isTTY

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

// By default, the development web server binds to all hostnames on the device (localhost, LAN network address, etc.). You may use this variable to specify a different host.
if (process.env.HOST) {
	console.log(chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`))
	console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`)
	console.log(`Learn more here: ${chalk.yellow('http://bit.ly/2mwWSwH')}`)
}

// some config in dev env
const devCofig = {
	mode: 'development',
	plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								// ... other plugins
								require.resolve('react-refresh/babel'),
							].filter(Boolean),
						},
					},
					{
						loader: 'ts-loader',
						options: {
							// 不做 ts 检查，单纯编译
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(js|jsx)?$/,
				loader: {
					loader: 'babel-loader',
					options: {
						plugins: [
							// ... other plugins
							require.resolve('react-refresh/babel'),
						].filter(Boolean),
					},
				},
				exclude: /node_modules/,
			},
		],
	},
}

const mergedConfig = merge(baseWebpackConfig, devCofig)

/**
 * We attempt to use the default port but if it is busy, we offer the user to
 * run on a different port. `choosePort()` Promise resolves to the next free port.
 */
choosePort(HOST, DEFAULT_PORT)
	.then((port) => {
		if (port == null) throw 'We have not found a port'

		const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
		const appName = require(paths.rootPackageJson).name
		const urls = prepareUrls(protocol, HOST, port)

		// Create a webpack compiler that is configured with custom messages.
		const compiler = createCompiler({ webpack, config: mergedConfig, appName, urls, useYarn })

		// Load proxy config（暂时不需要）
		// const proxySetting = require(paths.rootPackageJson).proxy
		// const proxyConfig = prepareProxy(proxySetting, paths.rootPublic)

		// Serve webpack assets generated by the compiler over a web sever.
		const serverConfig = createDevServerConfig(undefined, urls.lanUrlForConfig)
		serverConfig.sockHost = `localhost`
		serverConfig.sockPort = port
		const devServer = new WebpackDevServer(compiler, serverConfig)

		// Launch WebpackDevServer.
		devServer.listen(port, HOST, (err) => {
			if (err) {
				console.log(err)
				return
			}
			if (isInteractive) {
				clearConsole()
			}
			console.log(chalk.cyan('Starting the development server...\n'))
			openBrowser(urls.localUrlForBrowser)
		})
		;['SIGINT', 'SIGTERM'].forEach((sig) => {
			process.on(sig, () => {
				devServer.close()
				process.exit()
			})
		})
	})
	.catch((err) => {
		if (err && err.message) {
			console.log(err.message)
		}
		process.exit(1)
	})