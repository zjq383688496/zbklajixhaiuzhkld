const sequelize = require('./models')
const redis     = require('./redis/admin')

global.sequelize = sequelize
global.redis = redis
global.task  = {
	media_parse:  {
		state: false
	},
	media_encode: {
		state: false
	},
}

require('./task/media_parse')
require('./task/media_encode')

// module.exports = app
