const path = require('path')

function resolve(dir) {
	return path.resolve(__dirname, dir)
}

module.exports = function override(config, env) {
	config.resolve.alias = {
		'@': resolve('src'),
		'@assets': resolve('src/assets'),
	}
	return config
}