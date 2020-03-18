// const Tools = require('../common/tools')

module.exports = function(sequelize, DataTypes) {
	const Audio = sequelize.define('play_audio', {
		id:        { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		// parentId:  { type: DataTypes.BIGINT(11) },
		quality:   { type: DataTypes.STRING,  comment: '质量' },
		mimeType:  { type: DataTypes.STRING,  comment: '媒体信息' },
		initRange: { type: DataTypes.STRING,  comment: '初始范围' },
		bitrate:   { type: DataTypes.INTEGER, comment: '比特率' },
		duration:  { type: DataTypes.INTEGER, comment: '时长(毫秒)' },
		size:      { type: DataTypes.INTEGER, comment: '大小' },
		language:  { type: DataTypes.INTEGER, comment: '语言' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_img',
		// comment: '图片',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	// Img.afterFind(function(val) {
	// 	return Tools.dataToJSON(val)
	// })

	return Audio
}