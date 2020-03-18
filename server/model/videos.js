const fs = require('fs')
const { video } = require('../utils')
const { __tmp, sbin } = require('../config')

const videos = {
	// 列表
	list: async (ctx, next) => {
	},
	// 创建
	create: async (ctx, next) => {
		const { files: { file } } = ctx.request,
			{ path } = file
		const info = await video.getMediaInfo(path)
		const { path: _path } = await video.saveMedia(file)
		fs.unlinkSync(path)
		debugger
		ctx.resHandle('0000', info)
	},
	// 详情
	detail: async (ctx, next) => {
		const { id } = ctx.params
	},
	// 更新
	update: async (ctx, next) => {
		const { id } = ctx.params
	},
	// 删除
	delete: async (ctx, next) => {
		const { id } = ctx.params
	}
}

module.exports = videos