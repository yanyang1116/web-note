/**
 * @file
 * 因为用了 oneOf 优化，babel-loader 就不读配置文件
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

/**
 * 此插件可以单独开线程检查 ts 类型，从而提高编译速度，不过目前先不用
 * https://webpack.docschina.org/guides/build-performance/
 */
// const ForkTsCheckerWebpackPlugin =
// 	process.env.TSC_COMPILE_ON_ERROR === 'true'
// 		? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
// 		: require('react-dev-utils/ForkTsCheckerWebpackPlugin');
/**
 * 这个插件要和 react-refresh 配合使用，不然会报错
 * 这里值得注意的是，如果使用了这个插件 devServer 里的 hot 和 hotOnly 已经不用关心了
 */
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const cssLoaderConfig = require('./cssLoader.config');

const { appRootPathResolve } = require('./utils/pathResolve');
const alias = require('./utils/webpackResolveAlias');

require('./env/setEnv')();
require('./env/envLog')();

// 专门为 DefinePlugin 提供 env 的信息
const stringified = { 'process.env': {} };
Object.keys(process.env).forEach((key) => {
	stringified['process.env'][key] = JSON.stringify(process.env[key]);
});

const isEnvProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
	target: ['browserslist'], // 构建目标，尝试去配置文件寻找 browserslist 字段
	stats: 'errors-warnings', // 告警范围，仅错误和告警
	mode: process.env.NODE_ENV,
	entry: appRootPathResolve('./src/index.tsx'),
	bail: isEnvProduction, // Stop compilation early in production
	devtool: isEnvProduction ? 'source-map' : 'cheap-module-source-map',
	output: {
		path: appRootPathResolve('./dist'),
		publicPath: process.env.PUBLIC_URL,
		filename: isEnvProduction ? '[name].[contenthash:8].js' : '[name].js',
	},
	resolve: {
		alias,
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},
	infrastructureLogging: {
		level: 'none', // 禁用基础构建日志
	},
	module: {
		rules: [
			/**
			 * Handle node_modules packages that contain sourcemaps
			 * 详情看这里：https://webpack.docschina.org/loaders/source-map-loader/
			 * 大致意思是，第三方库有 source-map 的时候，这个 loader 会把他们加载收集
			 * 并且交给 webpack 根据 devtool source-map 类型进一步加工，然后可以 debugger 到指定的源文件
			 * 这里排除了 babel runtime 也是没什么好多说的，这类文件基本都是 es5 的沙盒函数，不需要
			 */
			{
				enforce: 'pre',
				exclude: /@babel(?:\/|\\{1,2})runtime/,
				test: /\.(js|mjs|jsx|ts|tsx|css)$/,
				loader: require.resolve('source-map-loader'),
			},
			{
				// oneOf 是从上到下的，优先命中
				oneOf: [
					{
						// webpack v5，使用 type 来替换原来的 loader
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						type: 'asset',
						parser: {
							dataUrlCondition: {
								// 注意，这个配置项说的单位是 k，1024 就是 1k
								maxSize: 1024 * 5,
							},
						},
					},
					{
						/**
						 * svg 可以直接作为 react 组件使用
						 * https://www.npmjs.com/package/@svgr/webpack
						 */
						test: /\.svg$/,
						use: [
							{
								loader: require.resolve('@svgr/webpack'),
								options: {
									prettier: false,
									svgo: false,
									svgoConfig: {
										plugins: [{ removeViewBox: false }],
									},
									titleProp: true,
									ref: true,
								},
							},
							// 普通的资源链接引入 svg 兜底，因为这个插件，看来 file loader 单独下载的
							{
								loader: require.resolve('file-loader'),
							},
						],
						issuer: {
							/**
							 * 文档解释：
							 * 只有在这些文件类型发起的 resolve 才会命中这个 loader
							 */
							and: [/\.(ts|tsx|js|jsx)$/],
						},
					},
					{
						test: /\.(jsx|ts|tsx)$/,
						include: [
							appRootPathResolve('./typing'),
							appRootPathResolve('./src'),
						],
						loader: require.resolve('babel-loader'),
						options: {
							/**
							 * presets 的顺序是从右往左
							 *
							 * preset-react
							 * 只要关注一个 runtime automatic 就可以了，其他不需要关注
							 *
							 * preset-env
							 * 根据 target 按需处理 polyfill、词法
							 * 它的配置中，只需要关心一个参数 useBuiltIns，该参数决定 polyfill 的处理
							 * entry：
							 * 你需要手动再文件中引入 polyfill，但是 preset 会根据你的环境，将你引入的重新按需细分
							 * usage：
							 * 你可以不用关心 polyfill， preset 会自动帮你按需处理，但是会挂到全局对象上
							 * false:
							 * 这个是默认值，不做任何处理，这个以前是配合 babel-polyfill 全量挂载用的
							 *
							 * 使用 transform-runtime 转化成沙盒工具函数会更好
							 *
							 * preset-typescript 先保持默认吧
							 */
							presets: [
								[
									'@babel/preset-env',
									{
										// 这个值设置成 false + transform-runtime 才是最佳实践
										useBuiltIns: false, // 虽然默认值就是 false，但这里显式的强调一下
									},
								],
								[
									'@babel/preset-react',
									{
										runtime: 'automatic', // 有了这个配置，在 jsx 中不需要一直 import react
									},
								],
								['@babel/preset-typescript'],
							],
							/**
							 * This is a feature of `babel-loader` for webpack (not Babel itself).
							 * It enables caching results in ./node_modules/.cache/babel-loader/
							 * directory for faster rebuilds.
							 * See #6846 for context on why cacheCompression is disabled
							 * 生产构建和开发构建都可以用 cache 所以没区分环境单独处理
							 * 文档中描述，开启缓存，速度至少提升 1 倍
							 * 注意，这个仅仅是讨论 babel-loader 的缓存处理，这么设置是最佳实践
							 */
							cacheDirectory: true,
							cacheCompression: false,
							/**
							 * could be used to enable the compact option for one specific file that is known to be large and minified
							 * and tell Babel not to bother trying to print the file nicely.
							 * 生产环境没有必要打印完整的上下文，所以 compact 为 true
							 */
							compact: process.env.NODE_ENV === 'production',
							plugins: [
								// react 热更新
								!isEnvProduction &&
									require.resolve('react-refresh/babel'),
								[
									'@babel/plugin-proposal-decorators',
									{ legacy: true },
								],
								[
									// 配合上文 useBuiltIns false，这里是自动 helper 函数转化
									'@babel/plugin-transform-runtime',
									{
										/**
										 * 需要配合下载 @babel/runtime-corejs3
										 * 这个插件其他保持默认即可
										 */
										corejs: 3,
									},
								],
							],
						},
					},
					{
						test: /\.(js|mjs)$/,
						/**
						 * 这个排除挺重要的，因为 node_modules 里的代码，其实也要管，不过 runtime 是不需要管的
						 * ↑↑↑ 因为 runtime 主要是 babel 运行时候的 polyfill 沙盒
						 * 配合 transform-runtime 转化用的，所以不用管（这个很重要，要理解这个机制，这个 exclude）
						 */
						exclude: /@babel(?:\/|\\{1,2})runtime/,
						loader: require.resolve('babel-loader'),
						options: {
							compact: false, // 因为基本上是 node_modules 或者自己写的普通函数，详细的打印就不需要了
							presets: [
								['@babel/preset-env', { useBuiltIns: false }],
							],
							/**
							 * This is a feature of `babel-loader` for webpack (not Babel itself).
							 * It enables caching results in ./node_modules/.cache/babel-loader/
							 * directory for faster rebuilds.
							 * See #6846 for context on why cacheCompression is disabled
							 * 生产构建和开发构建都可以用 cache 所以没区分环境单独处理
							 * 文档中描述，开启缓存，速度至少提升 1 倍
							 * 注意，这个仅仅是讨论 babel-loader 的缓存处理，这么设置是最佳实践
							 */
							cacheDirectory: true,
							cacheCompression: false,
							/**
							 * Babel sourcemaps are needed for debugging into node_modules
							 * code.  Without the options below, debuggers like VSCode
							 * show incorrect code and set breakpoints on the wrong lines.
							 *
							 * 这个解释看起来主要是为了更好的 debugger node_modules 设置的
							 * 我看 create app 里也是这个地方开了上文的因为没有 node_modules 所以没开
							 * 就认为是最佳实践吧
							 */
							sourceMaps: true,
							inputSourceMap: true,
						},
					},
					...cssLoaderConfig,
					/**
					 * "file" loader makes sure those assets get served by WebpackDevServer.
					 * When you `import` an asset, you get its (virtual) filename.
					 * In production, they would get copied to the `build` folder.
					 * This loader doesn't use a "test" so it will catch all modules
					 * that fall through the other loaders.
					 *
					 * type: 'asset/resource' 在 webpack v5 中就是 file-loader
					 * 这个是兜底处理
					 * 其实排除了 js 等文件，也排除了大多数在逻辑代码中涉及到的静态资源的 resolve
					 * 要想清楚这个顺序以及排除的关系（我单独用 webp 类型测试过，如果没有此 loader，无法处理这类文件）
					 */
					{
						/**
						 * Exclude `js` files to keep "css" loader working as it injects
						 * its runtime that would otherwise be processed through "file" loader.
						 * Also exclude `html` and `json` extensions so they get processed
						 * by webpacks internal loaders.
						 */
						exclude: [
							/^$/,
							/\.(js|mjs|jsx|ts|tsx)$/,
							// html 和 json 会使用内部加载器处理，所以要排除（by webpacks internal loaders）
							/\.html$/,
							/\.json$/,
						],
						type: 'asset/resource',
					},
					/**
					 * STOP! Are you adding a new loader?
					 * Make sure to add the new loader(s) before the "file" loader.
					 */
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin(
			Object.assign(
				{},
				{
					inject: true,
					template: appRootPathResolve('./index.html'),
				},
				{
					minify: {
						removeComments: true,
						collapseWhitespace: true,
						removeRedundantAttributes: true,
						useShortDoctype: true,
						removeEmptyAttributes: true,
						removeStyleLinkTypeAttributes: true,
						keepClosingSlash: true,
						minifyJS: true,
						minifyCSS: true,
						minifyURLs: true,
					},
				}
			)
		),
		/**
		 * index 模板内诸如 %PUBLIC_URL% 的变量，也可以通过 env 定义的字符串替换
		 * 做一些定制化是很有用的
		 */
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, process.env),

		// 模块未找到时提供一些上下文做排查
		new ModuleNotFoundPlugin(appRootPathResolve('./')),

		/**
		 * Makes some environment variables available to the JS code, for example:
		 * if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
		 * It is absolutely essential that NODE_ENV is set to production
		 * during a production build.
		 * Otherwise React will be compiled in the very slow development mode.
		 */
		new webpack.DefinePlugin(stringified),

		// Experimental hot reloading for React .
		// https://github.com/facebook/react/tree/main/packages/react-refresh
		new ReactRefreshWebpackPlugin({
			/**
			 * 这个遮罩会替换 devServer client 里的配置
			 */
			overlay: true,
		}),
	],
};

module.exports = baseConfig;
