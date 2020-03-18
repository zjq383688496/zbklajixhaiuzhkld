// const Tools = require('../common/tools')

module.exports = function(sequelize, DataTypes) {
	const Media = sequelize.define('play_media', {
		id:          { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:      { type: DataTypes.BIGINT(11), comment: '用户ID' },
		baseUrl:     { type: DataTypes.STRING,  comment: '基础地址' },
		title:       { type: DataTypes.STRING,  comment: '标题' },
		description: { type: DataTypes.STRING,  comment: '描述' },
		type:        { type: DataTypes.INTEGER, defaultValue: 1, comment: '类型' }		// 1: 视频, 2: 音频
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_img',
		// comment: '图片',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	// Media.afterFind(function(val) {
	// 	return Tools.dataToJSON(val)
	// })

	return Media
}