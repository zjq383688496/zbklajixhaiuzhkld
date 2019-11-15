const resMap = {
	'0000': { msg: '成功', status: 200 },
	'0001': { msg: '剧集ID不存在！' },
	'0002': { msg: '未查到该剧！' },
	'0003': { msg: '该剧已被删除！' },
	'9999': { msg: '系统异常' },
}

const resMsg = function(ctx, code = '0000', data, msg) {
	var res = resMap[code]
	ctx.body = {
		code,
		msg: msg || res.msg,
		data
	}
}

module.exports = resMsg
