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
	},
	__salt: 'cWRWpvPB2GNhY9Pt6diSDwK6s6SqxMHmizfDG352ohwQCdcDxvNNTPOC4KPfSn1s',
	__key: Buffer.from('zG134Ig5znU01oBA', 'utf8'),
	__iv: Buffer.from('8DPMw3jz8QFe5NgU', 'utf8')
}

module.exports = config

function _path(dir) {
	return path.resolve(__dirname, dir)
}