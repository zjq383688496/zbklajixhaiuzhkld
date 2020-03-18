var path     = require('path')
var pathRoot = process.cwd()
var webpack  = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

console.log(`pathRoot: ${pathRoot}`)

module.exports = {
	entry: path.resolve('./index.js'),
	output: {
	// 	libraryTarget: 'var',
	// 	path: path.resolve(pathRoot, './dist/'),
		publicPath: '/',
	// 	filename: '[name]_[hash:8].js',
	// 	chunkFilename: '[name]_[hash:8].js'
	},
	
	plugins: [
		new CopyWebpackPlugin([
			// { from: './src/static/zepto.min.js', to: 'static/zepto.js' }
		]),

		new HtmlWebpackPlugin({
			inject: 'body',
			template: './src/index.html',
			filename: 'index.html'
		})

		// new webpack.NoErrorsPlugin()
	],

	module: {},

	resolve: {
		modules: [
			'node_modules',
			path.resolve(pathRoot)
		],
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'@actions': 'src/store/actions',
			'@src':     'src',
			'@page':    'src/pages',
			'@server':  'src/server',
			'@comp':    'src/component',
			'@store':   'src/store',
			'@utils':   'src/utils',
			'@actions': 'src/store/actions',
			'@assets':  'src/assets'
		}
	},

	optimization: {
		runtimeChunk: true,
		splitChunks: {
			chunks: 'all'
		}
	}
}