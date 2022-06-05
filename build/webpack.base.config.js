/**
 * @file 因为用了 oneOf 优化，babel-loader 就不读配置文件
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
/**
 * 这个插件要和 react-refresh 配合使用，不然会报错
 * 这里值得注意的是，devServer 里的 hot 和 hotOnly 已经不用关心了（当然文档里还是保留这个字段的）
 * 如果使用这一套热加载机制的话，不需要额外配置了
 */
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const cssLoaderConfig = require('./cssLoader.config');

const {
	appRootPathResolve,
	relativePathResolve,
} = require('./utils/pathResolve');
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
	entry: appRootPathResolve('./src/index.jsx'),
	output: {
		path: relativePathResolve('../dist/', __dirname),
		publicPath: '/',
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
			{
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
							// 普通的资源链接引入 svg 兜底
							{
								loader: require.resolve('file-loader'),
							},
						],
						issuer: {
							/**
							 * 文档解释：
							 * 在规则中，属性 test, include, exclude 和 resource 对 resource 匹配，并且属性 issuer 对 issuer 匹配。
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
							 * 只要关注一个 runtime 自动导入就可以了，其他不需要关注
							 *
							 * preset-env
							 * 根据 target 按需处理 polyfill、词法
							 * 它的配置中，只需要关心一个参数 useBuiltIns，该参数决定 polyfill 的处理
							 * entry：
							 * 你需要手动再文件中引入 polyfill，但是 preset 会根据你的环境，将你引入的重新按需细分
							 * usage：
							 * 你可以不用关心 polyfill， preset 会自动帮你按需处理
							 * false:
							 * 这个是默认值，不做任何处理，这个以前是配合 babel-polyfill 全量挂载用的
							 *
							 * 使用 transform-runtime 转化成沙盒工具函数会更好，而且这个值就设置成 false，默认值
							 */
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: false, // 虽然默认值就是 false，但这里显式的强调一下
									},
								],
								[
									'@babel/preset-react',
									{
										runtime: 'automatic',
									},
								],
							],
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
					/**
					 * 这个是为了处理 js 和 mjs
					 * 为了配合 oneOf，所以这个优先级会略高
					 */
					{
						test: /\.(js|mjs)$/,
						/**
						 * 这个排除挺重要的，因为 node_modules 里的代码，其实也要管，不过 runtime 是不需要管的
						 * ↑↑↑ 因为 runtime 主要是 babel 运行时候的 polyfill 沙盒
						 * 配合 transform-runtime 转化用的，所以不用管
						 *
						 * 这个管了命中之后，由于 oneOf 原则，上面那条里只要写 includes 就好了
						 * 因为普通的包都是 JS 格式的，都到了这条里处理了
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
							 */
							cacheDirectory: true,
							cacheCompression: false,
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
					 * 要想清楚这个顺序以及排除的关系（这个已经使用 webp 类型测试过，如果没有此 loader，无法处理这类文件）
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

		// 模块未找到时提供一些用用的上下文做排查
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
			 * 不过如果是 true，则不可被关
			 */
			overlay: true,
		}),

		/**
		 * TypeScript type checking
		 * 加快 ts 检查，属于优化方面的插件
		 * https://www.npmjs.com/package/fork-ts-checker-webpack-plugin
		 */
		// new ForkTsCheckerWebpackPlugin({
		// 	async: process.env.NODE_ENV === 'development',
		// 	typescript: {
		// 		typescriptPath: resolve.sync('typescript', {
		// 			basedir: appRootPathResolve('./node_modules'),
		// 		}),
		// 		configOverwrite: {
		// 			compilerOptions: {
		// 				sourceMap: process.env.NODE_ENV === 'production',
		// 				skipLibCheck: true,
		// 				inlineSourceMap: false,
		// 				declarationMap: false,
		// 				noEmit: true,
		// 				incremental: true,
		// 				tsBuildInfoFile: appRootPathResolve(
		// 					'./node_modules/.cache/tsconfig.tsbuildinfo'
		// 				),
		// 			},
		// 		},
		// 		context: appRootPathResolve('./'),
		// 		diagnosticOptions: {
		// 			syntactic: true,
		// 		},
		// 		mode: 'write-references',
		// 	},
		// 	issue: {
		// 		// This one is specifically to match during CI tests,
		// 		// as micromatch doesn't match
		// 		// '../cra-template-typescript/template/src/App.tsx'
		// 		// otherwise.
		// 		include: [{ file: '**/src/**/*.{ts,tsx}' }],
		// 		exclude: [
		// 			// { file: '**/src/**/__tests__/**' },
		// 			// { file: '**/src/**/?(*.){spec|test}.*' },
		// 			// { file: '**/src/setupProxy.*' },
		// 			// { file: '**/src/setupTests.*' },
		// 		],
		// 	},
		// 	logger: {
		// 		infrastructure: 'silent',
		// 	},
		// }),
	],
};

module.exports = baseConfig;
