// const Tools = require('../common/tools')

module.exports = function(sequelize, DataTypes) {
	const Audio = sequelize.define('play_audio', {
		id:        { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		parentId:  { type: DataTypes.BIGINT,  comment: '父ID' },
		trackId:   { type: DataTypes.BIGINT,  comment: '轨道ID' },
		mimeType:  { type: DataTypes.STRING,  comment: '媒体信息' },
		initRange: { type: DataTypes.INTEGER, comment: '初始范围' },
		bitrate:   { type: DataTypes.FLOAT,   comment: '比特率' },
		duration:  { type: DataTypes.FLOAT,   comment: '时长(毫秒)' },
		size:      { type: DataTypes.BIGINT(11), comment: '大小' },
		url:       { type: DataTypes.STRING,  comment: 'URL' },
		language:  { type: DataTypes.INTEGER, comment: '语言' },
		// 0. 原始 1. 32 2. 64 3. 128, 4. 160
		quality:   { type: DataTypes.INTEGER, defaultValue: 0, comment: '质量' }
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

	// Img.afterFind(function(val) {
	// 	return Tools.dataToJSON(val)
	// })

	return Audio
}