/**
 * @file
 * css 部分其实可以不要太关心，这套基本上是 create react app 的配置
 * 沿用就可以了
 */

// style files regexes
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const { appRootPathResolve } = require('./utils/pathResolve');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const isEnvProduction = process.env.NODE_ENV === 'production';

const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		// 开发环境，将 css-loader 转化来的数据，以 style 标签形式写入 html
		!isEnvProduction && require.resolve('style-loader'),
		// 生产环境，使用这个 loader 压缩并抽出单独的文件
		isEnvProduction && {
			loader: MiniCssExtractPlugin.loader,
			// 路径的插入方式，是唯一一个值得关注的配置项
			// options: { publicPath: '../../' }
		},
		{
			/**
			 * css-loader 是用来处理 文件中被 import、require 的 css
			 * 将他们转化为内存对象，等下一步的处理
			 */
			loader: require.resolve('css-loader'),
			options: cssOptions,
		},
		{
			/**
			 * Options for PostCSS as we reference these options twice
			 * Adds vendor prefixing based on your specified browser support in
			 * package.json
			 *
			 * 下面这套 postcss 是 createReactApp 的一个比较好的实践
			 */
			loader: require.resolve('postcss-loader'),
			options: {
				postcssOptions: {
					// Necessary for external CSS imports to work
					// https://github.com/facebook/create-react-app/issues/2677
					ident: 'postcss',
					config: false,
					plugins: [
						'postcss-flexbugs-fixes',
						[
							// 会读取标准的 browserslist 配置信息
							'postcss-preset-env',
							{
								autoprefixer: {
									flexbox: 'no-2009',
								},
								stage: 3,
							},
						],
						// Adds PostCSS Normalize as the reset css with default options,
						// so that it honors browserslist config in package.json
						// which in turn let's users customize the target behavior as per their needs.
						'postcss-normalize',
					],
				},
				sourceMap: isEnvProduction,
			},
		},
	].filter(Boolean);

	if (preProcessor) {
		/**
		 * resolve-url-loader 是专门为了配合 sass-loader 使用的
		 * 这里其实也算是写死的使用 sass，这个保持默认就行了，不要太关心配置
		 */
		loaders.push(
			{
				loader: require.resolve('resolve-url-loader'),
				options: {
					sourceMap: isEnvProduction,
					root: appRootPathResolve('./src'),
				},
			},
			{
				loader: require.resolve(preProcessor),
				options: {
					sourceMap: true,
				},
			}
		);
	}
	return loaders;
};

module.exports = [
	{
		test: cssRegex,
		exclude: cssModuleRegex,
		use: getStyleLoaders({
			importLoaders: 1,
			sourceMap: isEnvProduction,
			modules: {
				mode: 'icss',
			},
		}),
		// Don't consider CSS imports dead code even if the
		// containing package claims to have no side effects.
		// Remove this when webpack adds a warning or an error for this.
		// See https://github.com/webpack/webpack/issues/6571
		sideEffects: true,
	},
	// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
	// using the extension .module.css
	{
		test: cssModuleRegex,
		use: getStyleLoaders({
			importLoaders: 1,
			sourceMap: isEnvProduction,
			modules: {
				mode: 'local',
				getLocalIdent: getCSSModuleLocalIdent,
			},
		}),
	},
	// Opt-in support for SASS (using .scss or .sass extensions).
	// By default we support SASS Modules with the
	// extensions .module.scss or .module.sass
	{
		test: sassRegex,
		exclude: sassModuleRegex,
		use: getStyleLoaders(
			{
				importLoaders: 3,
				sourceMap: isEnvProduction,
				modules: {
					mode: 'icss',
				},
			},
			'sass-loader'
		),
		// Don't consider CSS imports dead code even if the
		// containing package claims to have no side effects.
		// Remove this when webpack adds a warning or an error for this.
		// See https://github.com/webpack/webpack/issues/6571
		sideEffects: true,
	},
	// Adds support for CSS Modules, but using SASS
	// using the extension .module.scss or .module.sass
	{
		test: sassModuleRegex,
		use: getStyleLoaders(
			{
				importLoaders: 3,
				sourceMap: isEnvProduction,
				modules: {
					mode: 'local',
					getLocalIdent: getCSSModuleLocalIdent,
				},
			},
			'sass-loader'
		),
	},
];
