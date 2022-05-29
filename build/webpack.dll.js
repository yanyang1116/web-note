// const path = require('path')
// const webpack = require('webpack')

// // define vendors
// const vendorMap = ['react', 'react-dom', 'react-router-dom', 'axios', 'history', 'redux', 'react-redux', 'redux-thunk', 'lodash.map']

// module.exports = {
// 	context: __dirname,
// 	entry: {
// 		vendor: vendorMap,
// 	},
// 	output: {
// 		path: path.join(__dirname, './dll'),
// 		filename: 'dll.[name].js',
// 		library: '[name]',
// 	},
// 	plugins: [
// 		new webpack.DllPlugin({
// 			path: path.join(__dirname, './dll/[name]-manifest.json'),
// 			name: '[name]',
// 		}),
// 	],
// }
