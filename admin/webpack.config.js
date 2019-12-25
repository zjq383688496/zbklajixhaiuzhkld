const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

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
		]
	},
	plugins: [
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
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__isBrowser__: "false"
		})
	]
}

module.exports = [ clientConfig, serverConfig ]