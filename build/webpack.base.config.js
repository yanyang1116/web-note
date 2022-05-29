const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const npm_package = require('../package.json')
const appRootPathResolve = require('../utils/build')

const pathResolve = (relativePath) => path.resolve(__dirname, relativePath)

Object.keys(npm_package._moduleAliases).forEach((item) => {
	npm_package._moduleAliases[item] = appRootPathResolve(npm_package._moduleAliases[item])
})

const aliasMap = npm_package._moduleAliases

const baseConfig = {
	entry: appRootPathResolve('./src/view/index.tsx'),
	output: {
		path: pathResolve('../dist/'),
		publicPath: '/',
		filename: '[name].js',
	},
	resolve: {
		alias: aliasMap,
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},
	performance: {
		hints: false,
	},
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 1024,
					name: '[name]_[hash:5].[ext]',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: appRootPathResolve('./template/index.html'),
		}),
	],
}

module.exports = baseConfig
