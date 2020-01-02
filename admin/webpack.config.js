const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
		path: __dirname,
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
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.less/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
				// loader: 'style-loader!css-loader!less-loader?javascriptEnabled=true'
			},
		]
	},
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