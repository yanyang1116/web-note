const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
	appRootPathResolve,
	relativePathResolve,
} = require('./utils/pathResolve');
const alias = require('./utils/webpackResolveAlias');

const baseConfig = {
	entry: appRootPathResolve('./src/view/index.tsx'),
	output: {
		path: relativePathResolve('../dist/'),
		publicPath: '/',
		filename: '[name].js',
	},
	resolve: {
		alias,
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
			template: appRootPathResolve('./index.html'),
		}),
	],
};

module.exports = baseConfig;
