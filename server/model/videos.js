const fs = require('fs')
const { redis, video } = require('../utils')
const { sbin } = require('../config')

const videos = {
	// 列表
	list: async (ctx, next) => {
		ctx.body = await redis.lrange('videos', 0, 100)
	},
	// 创建
	create: async (ctx, next) => {
		const { files: { file } } = ctx.request,
			{ hash, name, path, size, type } = file
		const info = await video.getMediaInfo(path)
		fs.unlinkSync(path)
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