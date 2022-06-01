const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
	appRootPathResolve,
	relativePathResolve,
} = require('./utils/pathResolve');
const alias = require('./utils/webpackResolveAlias');

require('./env/setEnv')();
require('./env/envLog')();

const baseConfig = {
	target: ['browserslist'], // 构建目标，尝试去配置文件寻找 browserslist 字段
	stats: 'errors-warnings', // 告警范围，仅错误和告警
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
	infrastructureLogging: {
		level: 'none', // 禁用基础构建日志
	},
	module: {
		rules: [
			// 这个先注释，看看加了和没加的区别，要加到时候也不要在 base 里加，还要对比下和自带的 source-map 的区别
			// {
			// 	enforce: 'pre',
			// 	exclude: /@babel(?:\/|\\{1,2})runtime/,
			// 	test: /\.(js|mjs|jsx|ts|tsx|css)$/,
			// 	loader: require.resolve('source-map-loader'),
			// },
			{
				// webpack v5，使用 type 来替换原来的 loader
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 1024, // TODO 试一下
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
					 * 预先确认需要使用此 loader 的文件类型
					 * TODO 到时候试试
					 */
					and: [/\.(ts|tsx|js|jsx)$/],
				},
			},
			{
				// 理论上不用写 js 和 mjs，因为 oneOf，TODO 删除试试
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				include: [
					appRootPathResolve('./typing'),
					appRootPathResolve('/src'),
				],
				loader: require.resolve('babel-loader'),
				options: {
					presets: [
						[
							require.resolve('babel-preset-react-app'),
							{
								/**
								 * 虽然 classic 是默认值，不过这里还有自动导入的模式
								 * 我觉得不需要，详情可以看
								 * https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
								 */
								runtime: 'classic',
							},
						],
					],
					plugins: [
						// isEnvDevelopment &&
						// 	shouldUseReactRefresh &&
						// 根据环境看，TODO 这个要测一下
						require.resolve('react-refresh/babel'),
					].filter(Boolean),
					cacheDirectory: true,
					cacheCompression: false,
					/**
					 * could be used to enable the compact option for one specific file that is known to be large and minified
					 * and tell Babel not to bother trying to print the file nicely.
					 * 生产环境没有必要打印完整的上下文，所以 compact 为 true
					 */
					// compact: isEnvProduction,
				},
			},
			/**
			 * 这个是为了处理 js 和 mjs
			 * 为了配合 oneOf，所以这个优先级会略高
			 */
			{
				test: /\.(js|mjs)$/,
				/**
				 * 这个排除挺重要的，因为 node_modules 里的代码，其实也要管
				 * 不过 runtime 是不需要管的
				 * 这个管了命中之后，由于 oneOf 原则，上面那条里只要写 includes 就好了
				 * 因为普通的包都是 JS 格式的，都到了这条里处理了
				 */
				exclude: /@babel(?:\/|\\{1,2})runtime/,
				loader: require.resolve('babel-loader'),
				options: {
					// 不走配置文件了，直接用 react 团队的 creat-app 的 babel 预设
					babelrc: false,
					configFile: false,
					compact: false, // 因为基本上是 node_modules 或者自己写的普通函数，详细的打印就不需要了
					presets: [
						[
							// 处理普通 js 的预设
							require.resolve(
								'babel-preset-react-app/dependencies'
							),
							/**
							 * 这个指的是公用的 help 函数
							 * babel 按需转化 api 时候产生的工具函数
							 * TODO 这个要验证一下
							 */
							{ helpers: true },
						],
					],
					/**
					 * This is a feature of `babel-loader` for webpack (not Babel itself).
					 * It enables caching results in ./node_modules/.cache/babel-loader/
					 * directory for faster rebuilds.
					 * See #6846 for context on why cacheCompression is disabled
					 * 生产构建和开发构建都可以用 cache 所以没区分环境单独处理
					 * 文档中描述，开启缓存，速度至少提升1倍
					 */
					cacheDirectory: true,
					cacheCompression: false,
					/**
					 * 为什么 sourceMap 不放在上文 tsx 和 jsx 的转化上面
					 * TODO，这个先注释，要试一下看具体输出
					 * 而且如果上文有了 source-map loader 还需要这两个配置吗
					 */
					// sourceMaps: shouldUseSourceMap,
					// inputSourceMap: shouldUseSourceMap,
				},
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
		// index 模板内诸如 %PUBLIC_URL% 的变量，也可以通过 env 替换
		// TODO 等下，这个参数 console 要确认下
		// new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

		// 模块未找到时提供一些用用的上下文做排查
		new ModuleNotFoundPlugin(appRootPathResolve('./')),

		/**
		 * Makes some environment variables available to the JS code, for example:
		 * if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
		 * It is absolutely essential that NODE_ENV is set to production
		 * during a production build.
		 * Otherwise React will be compiled in the very slow development mode.
		 *
		 * 可以看出 DefinePlugin 只对 js 代码有效
		 * new webpack.DefinePlugin(env.stringified)
		 * TODO，这个要具体打印
		 */
		new webpack.DefinePlugin(),

		// Experimental hot reloading for React .
		// https://github.com/facebook/react/tree/main/packages/react-refresh
		new ReactRefreshWebpackPlugin({
			overlay: true, // TODO 试下开关的效果
		}),

		// TypeScript type checking
		new ForkTsCheckerWebpackPlugin({
			async: process.env.TZ,
			typescript: {
				typescriptPath: resolve.sync('typescript', {
					basedir: paths.appNodeModules,
				}),
				configOverwrite: {
					compilerOptions: {
						sourceMap: isEnvProduction
							? shouldUseSourceMap
							: isEnvDevelopment,
						skipLibCheck: true,
						inlineSourceMap: false,
						declarationMap: false,
						noEmit: true,
						incremental: true,
						tsBuildInfoFile: paths.appTsBuildInfoFile,
					},
				},
				context: paths.appPath,
				diagnosticOptions: {
					syntactic: true,
				},
				mode: 'write-references',
				// profile: true,
			},
			issue: {
				// This one is specifically to match during CI tests,
				// as micromatch doesn't match
				// '../cra-template-typescript/template/src/App.tsx'
				// otherwise.
				include: [
					{ file: '../**/src/**/*.{ts,tsx}' },
					{ file: '**/src/**/*.{ts,tsx}' },
				],
				exclude: [
					{ file: '**/src/**/__tests__/**' },
					{ file: '**/src/**/?(*.){spec|test}.*' },
					{ file: '**/src/setupProxy.*' },
					{ file: '**/src/setupTests.*' },
				],
			},
			logger: {
				infrastructure: 'silent',
			},
		}),
	],
};

module.exports = baseConfig;
