const path = require('path')

const config = {
	__tmp: _path('../tmp'),
	dirname: __dirname,
	__encode: _path('./.encode'),
	sbin: {
		ffmpeg:      _path('./sbin/ffmpeg'),
		ffprobe:     _path('./sbin/ffprobe'),
		mp4dump:     _path('./sbin/mp4dump'),
		mp4fragment: _path('./sbin/mp4fragment'),
		mp4info:     _path('./sbin/mp4info')
	},
	upyun: {
		bucket: 'rongyi',
		user:   'gongzhen',
		pass:   'rynw87^%43'
	},
	redis: {
		port: 6381,
		host: '127.0.0.1',
		// family: 4,
		// password: '',
		db: 0
	},
	mysql: {
		db: 'play',
		user: 'root',
		pass: 'zjqzjqzjq',
		opts: {
			host: '127.0.0.1',
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