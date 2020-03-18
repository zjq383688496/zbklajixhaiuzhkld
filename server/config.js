const path = require('path')

const config = {
	__tmp: _path('../tmp'),
	__dirname: __dirname,
	__encode: _path('./.encode'),
	sbin: {
		ffmpeg: _path('./sbin/ffmpeg'),
		ffprobe: _path('./sbin/ffprobe')
	},
	upyun: {
		bucket: 'rongyi',
		user:   'gongzhen',
		pass:   'rynw87^%43'
	},
	redis: {
		port: 6381,
		host: '10.1.106.239',
		// family: 4,
		// password: '',
		db: 0
	},
	mysql: {
		db: 'play',
		user: 'root',
		pass: 'zjqzjqzjq',
		opts: {
			host: '10.1.106.239',
			dialect: 'mysql',
			// pool: {
			// 	max: 5,
			// 	min: 0,
			// 	idle: 10000
			// }
		}
	}
}

module.exports = config

function _path(dir) {
	return path.resolve(__dirname, dir)
}