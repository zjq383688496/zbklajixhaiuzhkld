const resMap = {
	'0000': '成功',
	'0001': '视频不存在！',
	'0002': '参数不正确！',
	'0003': '该剧已被删除！',
	'9999': '系统异常',
}

const resMsg = function(code = '0000', data, msg) {
	var res = resMap[code]
	this.body = {
		code,
		msg: msg || res,
		data
	}
}

module.exports = resMsg
