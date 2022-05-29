module.exports = {
	presets: [
		"@babel/preset-typescript",
		'@babel/preset-react',
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'usage',
				corejs: 3,
			},
		],
	],
	plugins: [
		'@babel/plugin-transform-runtime',
		["@babel/plugin-proposal-decorators", { "legacy": true }],
		["@babel/plugin-proposal-class-properties", { "loose" : true }],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-export-default-from',
	],
};
