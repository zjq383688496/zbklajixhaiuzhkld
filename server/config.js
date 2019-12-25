const path = require('path')

const config = {
	__dirname: __dirname,
	sbin: {
		ffmpeg: _path('./sbin/ffmpeg'),
		ffprobe: _path('./sbin/ffprobe')
	},
	upyun: {
		bucket: 'rongyi',
		user:   'gongzhen',
		pass:   'rynw87^%43'
	}
}

module.exports = config

function _path(dir) {
	return path.resolve(__dirname, dir)
}