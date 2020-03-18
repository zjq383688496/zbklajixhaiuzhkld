const sequelize = require('./models')
const redis     = require('./redis/admin')
const schedule = require('node-schedule')

global.sequelize = sequelize
global.redis = redis
global.task  = {
	media_encode: {}
}

require('./task/media_encode')

// module.exports = app
