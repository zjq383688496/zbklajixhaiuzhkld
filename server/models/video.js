// const Tools = require('../common/tools')

module.exports = function(sequelize, DataTypes) {
	const Video = sequelize.define('play_video', {
		id:        { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		parentId:  { type: DataTypes.BIGINT(11), comment: '父ID' },
		mimeType:  { type: DataTypes.STRING,  comment: '媒体信息' },
		initRange: { type: DataTypes.INTEGER, comment: '初始范围' },
		fps:       { type: DataTypes.FLOAT,   comment: '帧速率' },
		bitrate:   { type: DataTypes.FLOAT,   comment: '比特率' },
		duration:  { type: DataTypes.FLOAT,   comment: '时长(秒)' },
		size:      { type: DataTypes.BIGINT(11), comment: '大小' },
		url:       { type: DataTypes.STRING,  comment: 'URL' },
		width:     { type: DataTypes.INTEGER, defaultValue: 0,  comment: '宽' },
		height:    { type: DataTypes.INTEGER, defaultValue: 0,  comment: '高' },
		// 0. 原始 1. 240 2. 360 3. 480 4. 720 5. 1080 6. 2160
		quality:   { type: DataTypes.INTEGER, defaultValue: 0,  comment: '质量' }
	}, {
		freezeTableName: false,
		// freezeTableName: true,
		// tableName: 'cms_img',
		// comment: '图片',
		// charset: 'utf8',
		// collate: 'utf8_general_ci',
		getterMethods: {
			initRange: function() {
				let { initRange }  = this.dataValues
				return { start: 0, end: +initRange }
			}
		}
	})

	return Video
}