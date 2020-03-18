const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const __src__ = path.resolve(__dirname, 'src/shared')
console.log('__src__: ', __src__)

const resolve = {
	// extensions: ['', '.js'],
	alias: {
		'@component': `${__src__}/component`,
		'@service':   `${__src__}/service`,
	}
}

// const MCEP = {
// 	loader: MiniCssExtractPlugin.loader,
// }

const clientConfig = {
	entry: './src/client/index.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	devtool: 'inline-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						babelrc: false,
						presets: [
							[
								'@babel/env', {
									targets: {
										'browsers': ['Chrome >=59']
									},
									modules: false,
									loose: true
								}
							],
							'@babel/preset-react'
						],
						plugins: [
							'@babel/proposal-object-rest-spread',
							'@babel/proposal-class-properties'
						]
					}
				}]
			},
			{
				test: /\.css/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.less/,
				loader: 'style-loader!css-loader!less-loader?sourceMap=true&javascriptEnabled=true'
			},
		]
	},
	resolve,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css',
		}),
		new webpack.DefinePlugin({
			__isBrowser__: "true"
		})
	]
}

const serverConfig = {
	entry: './src/server/index.js',
	target: 'node',
	externals: [nodeExternals()],
	output: {
		// path: __dirname,
		path: path.resolve(__dirname, 'publicServer'),
		filename: 'server.js',
		publicPath: '/'
	},
	devtool: 'inline-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						babelrc: false,
						presets: [
							[
								'@babel/env', {
									targets: {
										'browsers': ['Chrome >=59']
									},
									modules: false,
									loose: true
								}
							],
							'@babel/preset-react'
						],
						plugins: [
							'@babel/proposal-object-rest-spread',
							'@babel/proposal-class-properties'
						]
					}
				}]
			},
			{
				test: /\.css/,
				use: [
					'isomorphic-style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.less/,
				use: [
					'isomorphic-style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
				// loader: 'style-loader!css-loader!less-loader?javascriptEnabled=true'
			},
		]
	},
	resolve,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css',
		}),
		new webpack.DefinePlugin({
			__isBrowser__: "false"
		})
	]
}

module.exports = [ clientConfig, serverConfig ]