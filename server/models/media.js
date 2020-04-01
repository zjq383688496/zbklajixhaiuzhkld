const { salt } = require('../utils/crypto')

module.exports = function(sequelize, DataTypes) {
	const Media = sequelize.define('play_media', {
		id:          { type: DataTypes.BIGINT(11), primaryKey: true, autoIncrement: true, unique : true },
		code:        { type: DataTypes.STRING,     primaryKey: true, defaultValue: '', comment: '视频CODE' },
		hash:        { type: DataTypes.STRING,     comment: 'HASH' },
		userId:      { type: DataTypes.BIGINT(11), comment: '用户ID' },
		title:       { type: DataTypes.STRING,     comment: '标题' },
		description: { type: DataTypes.STRING,     comment: '描述' },
		// 1. 视频 2. 音频
		type:        { type: DataTypes.INTEGER, defaultValue: 1, comment: '类型' },
		frozen:      { type: DataTypes.BOOLEAN, defaultValue: false, comment: '冻结' },
		// 1. 未上传 2. 审核中 3. 审核成功 4. 审核失败
		status:      { type: DataTypes.INTEGER, defaultValue: 1, comment: '状态' },
	}, {
		freezeTableName: false,
		setterMethods: {
			// 设置加盐code
			// hash: function(value) {
			// 	var code = salt(value)
			// 	debugger
			// 	this.setDataValue('code', code)
			// 	this.setDataValue('hash', value)
			// }
		}
	})

	// Media.afterFind(function(val) {
	// 	return Tools.dataToJSON(val)
	// })

	return Media
}