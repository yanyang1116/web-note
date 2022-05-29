// const path = require('path')
// const rm = require('rimraf')
// const webpack = require('webpack')
// const merge = require('webpack-merge')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// // const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const ora = require('ora')
// const chalk = require('chalk')

// const baseConfig = require('./webpack.base.config')

// const postCssConfig = {
// 	loader: 'postcss-loader',
// 	options: {
// 		plugins: [
// 			/* eslint-disable */
// 			require('postcss-preset-env')(),
// 			/* eslint-enable */
// 		]
// 	}
// }

// const pathResolve = (dir) => path.join(__dirname, dir)

// const prdConfig = {
// 	output: {
// 		path: pathResolve('../dist'),
// 		filename: '[name].[hash:5].js'
// 		/* defined your public path here */
// 		// publicPath: '',
// 	},
// 	devtool: 'source-map',
// 	mode: 'production',
// 	module: {
// 		rules: [
// 			{
// 				test: /\.less$/,
// 				use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders: 2 } }, postCssConfig, 'less-loader']
// 			},
// 			{
// 				test: /\.css$/,
// 				use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders: 1 } }, postCssConfig]
// 			}
// 		]
// 	},
// 	optimization: {
// 		// 这个先不放了，这里 webpack 会有个错，可能是和 ts 结合的时候的兼容问题
// 		// minimizer: [new UglifyJsPlugin({
// 		// 	extractComments: true,
// 		// 	sourceMap: true,
// 		// 	uglifyOptions: {
// 		// 		output: {
// 		// 			comments: false,
// 		// 		},
// 		// 		compress: {
// 		// 			drop_console: true,
// 		// 			drop_debugger: true,
// 		// 		},
// 		// 	},
// 		// })],
// 		splitChunks: {
// 			automaticNameDelimiter: '_',
// 			chunks: 'all'
// 		}
// 	},
// 	plugins: [
// 		/* 如果要用dll，这里需要配合开启 */
// 		// new webpack.DllReferencePlugin({
// 		// 	context: __dirname,
// 		// 	manifest: require('./dll/vendor-manifest.json'),
// 		// }),
// 		new MiniCssExtractPlugin({
// 			filename: '[name].[hash:5].css'
// 		}),
// 		new OptimizeCSSAssetsPlugin()
// 	],
// 	stats: {
// 		children: false,
// 		modules: false
// 	}
// }

// const webpackConfig = merge(baseConfig, prdConfig)

// const spinner = ora('Building...')
// spinner.start()

// rm.sync(path.join(pathResolve('../dist')))

// webpack(webpackConfig, (err, stats) => {
// 	spinner.stop()
// 	if (err) throw err

// 	process.stdout.write(
// 		`${stats.toString({
// 			colors: true,
// 			modules: false,
// 			children: false,
// 			chunks: false,
// 			chunkModules: false
// 		})}\n\n`
// 	)

// 	if (stats.hasErrors()) {
// 		console.log(chalk.red('  Build failed with errors.\n'))
// 		process.exit(1)
// 	}

// 	console.log(chalk.cyan('  Build complete.\n'))
// })
