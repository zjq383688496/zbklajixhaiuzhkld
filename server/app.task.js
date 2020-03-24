const sequelize = require('./models')
const redis     = require('./redis/admin')

global.sequelize = sequelize
global.redis = redis
global.task  = {
	media_parse:  {},
	media_encode: {},
	curHashDir: '',
}

require('./task/media_parse')
require('./task/media_encode')

// module.exports = app
