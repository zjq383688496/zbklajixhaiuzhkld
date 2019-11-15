const fs = require('fs')
const { mysql, resHandle } = require('../utils')

const { path } = require('../config')
const { resource } = path

const live = {
	list: async (ctx, next) => {
		var { id } = ctx.query
		if (!id) return resHandle(ctx, '0001')
		var { err, results } = await mysql.query(`SELECT * FROM rtmp.live WHERE id=${id}`)
		if (err || !results.length) return resHandle(ctx, '0002')
		var parent     = results[0],
			parentPath = parent.path,
			{ err, results } = await mysql.query(`SELECT * FROM rtmp.resource WHERE parentId=${id} LIMIT 0, 100`)
		if (err || !results.length) return resHandle(ctx, '0003')

		return resHandle(ctx, '0000', {
			...parent,
			data: results.map(_ => {
				_.path = `${parentPath}/${_.path}`
				return _
			})
		})
	}
}

module.exports = live