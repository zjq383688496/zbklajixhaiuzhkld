const path = require('path')

const config = {
	path: {
		dirname: __dirname,
		resource: path.resolve(__dirname, '../resource'),
		ffmpeg: '/Users/zhuangjiaqi/tools/ffmpeg/bin'
	},
	upyun: {
		bucket: 'rongyi',
		user:   'gongzhen',
		pass:   'rynw87^%43'
	}
}

module.exports = config