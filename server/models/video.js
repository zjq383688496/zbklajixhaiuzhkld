// const Tools = require('../common/tools')

module.exports = function(sequelize, DataTypes) {
	const Video = sequelize.define('play_video', {
		id:        { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		// parentId:  { type: DataTypes.BIGINT(11) },
		quality:   { type: DataTypes.STRING,  comment: '质量' },
		mimeType:  { type: DataTypes.STRING,  comment: '媒体信息' },
		initRange: { type: DataTypes.STRING,  comment: '初始范围' },
		fps:       { type: DataTypes.INTEGER, comment: '帧速率' },
		bitrate:   { type: DataTypes.INTEGER, comment: '比特率' },
		duration:  { type: DataTypes.INTEGER, comment: '时长(秒)' },
		size:      { type: DataTypes.INTEGER, comment: '大小' },
		width:     { type: DataTypes.INTEGER, defaultValue: 0, comment: '宽' },
		height:    { type: DataTypes.INTEGER, defaultValue: 0, comment: '高' },
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_img',
		// comment: '图片',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	return Video
}