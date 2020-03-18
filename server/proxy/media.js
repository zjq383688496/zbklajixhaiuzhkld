const { redis, sequelize } = global
const fs = require('fs')
const { Media } = sequelize
const { getMediaInfo } = require('../utils/video')


// 获取媒体列表
async function list(ctx, next) {
	let result = await Media.findAll()
	if (result && result.length >= 0) ctx.resHandle('0000', result)
}

// 获取媒体信息
async function detail(ctx, next) {
	let { params } = ctx
	let result = await Media.findOne({ where: params })
	ctx.resHandle('0000', result)
}

// 创建媒体
async function create(ctx, next) {
	let { body } = ctx.request
	let result = await Media.create(body)
	debugger
	ctx.resHandle('0000', result)
}

// 上传媒体
async function upload(ctx, next) {
	let { body, files: { file } } = ctx.request,
		{ hash, path } = file
	let data  = JSON.stringify({ ...body, path })
	let exist = await redis.exists(hash)
	let info  = await getMediaInfo(path)
	if (exist) {
		fs.unlinkSync(path)
		return ctx.resHandle('0000', info)
	}
	await redis.lpush('task_queue', hash)
	await redis.set(hash, data)
	ctx.resHandle('0000', info)
}

module.exports = {
	list,
	create,
	detail,
	upload
}

