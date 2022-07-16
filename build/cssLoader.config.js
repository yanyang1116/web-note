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
			// 路径的插入方式，是唯一一个值得关注的配置项，暂时注释
			// options: { publicPath: '../../' }
		},
		/**
		 * 生成 scss-module 声明文件
		 * https://github.com/Megaputer/dts-css-modules-loader
		 * 放这里是有道理的，要等 css 文件出来之后，才能构建平级的声明关系
		 */
		preProcessor?.isCssModule && {
			loader: 'dts-css-modules-loader',
			options: {
				namedExport: true,
			},
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
			...preProcessor.loaders.map((item) => ({
				loader: require.resolve(item),
				options: {
					sourceMap: true,
				},
			}))
		);
	}
	return loaders;
};

module.exports = [
	{
		test: cssRegex,
		exclude: cssModuleRegex,
		use: getStyleLoaders({
			importLoaders: 1, // 指的是 post-css
			sourceMap: isEnvProduction,
			modules: {
				/**
				 * ICSS 提供 CSS Module 支持，并且为其他工具提供了一个底层语法，以实现它们自己的 css-module 变体。
				 * 看了下，没看懂，保持这个默认值就好，后面有很多地方都有这个设置
				 */
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
			importLoaders: 1, // post-css
			sourceMap: isEnvProduction,
			modules: {
				// 这里说的是通过，getCSSModuleLocalIdent 结合本地来生成 hash，以便于符合 css modules 的作用域隔离
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
				importLoaders: 3, // sass-loader、resolve-url-loader、post-css
				sourceMap: isEnvProduction,
				modules: {
					mode: 'icss',
				},
			},
			{ loaders: ['sass-loader'] }
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
				importLoaders: 3, // sass-loader、resolve-url-loader、post-css
				sourceMap: isEnvProduction,
				modules: {
					// 这里说的是通过，getCSSModuleLocalIdent 结合本地来生成 hash，以便于符合 scss modules 的作用域隔离
					mode: 'local',
					getLocalIdent: getCSSModuleLocalIdent,
				},
			},
			{
				isCssModule: true,
				loaders: ['sass-loader'],
			}
		),
	},
];
