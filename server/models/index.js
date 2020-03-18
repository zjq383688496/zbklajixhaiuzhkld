const Sequelize = require('sequelize')
const config    = require('../config')
const { db, user, pass, opts } = config.mysql
// const Op        = Sequelize.Op

// if (Op) {
// 	mysql.opts.operatorsAliases = {
// 		$like: Op.like,
// 	}
// }

const sequelize = new Sequelize(db, user, pass, opts)

const Media = require('./media')(sequelize, Sequelize)
const Video = require('./video')(sequelize, Sequelize)
const Audio = require('./audio')(sequelize, Sequelize)

Media.belongsToMany(Video, { as: 'videos', through: 'parentId', foreignKey: 'id' })
Media.belongsToMany(Audio, { as: 'audios', through: 'parentId', foreignKey: 'id' })

sequelize.sync()

module.exports = {
	Media,
	Video,
	Audio
}
