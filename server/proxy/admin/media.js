const { redis, sequelize } = global
const fs = require('fs')
const { __encode } = require('../../config')
const { Media, Video, Audio } = sequelize
const { getMediaInfo } = require('../../utils/video')
const { salt } = require('../../utils/crypto')


// 获取媒体列表
async function list(ctx, next) {
	let result = await Media.findAll({ attributes: { exclude: ['userId', 'hash', 'code'] } })
	if (result && result.length >= 0) ctx.resHandle('0000', result)
}

// 获取媒体信息
async function detail(ctx, next) {
	let { params } = ctx
	let result = await Media.findOne({ where: params })
	if (!result) return ctx.resHandle('0001', result)
	let { id } = result,
		parentId   = id
	let videos = await Video.findAll({ where: { parentId }})
	let audios = await Audio.findAll({ where: { parentId }})
	videos = videos.filter(item => item.url)
	audios = audios.filter(item => item.url)
	result.dataValues.streams = JSON.parse(JSON.stringify([ ...videos, ...audios ]))
	ctx.resHandle('0000', result.dataValues)
}

// 创建媒体
async function create(ctx, next) {
	let { body } = ctx.request
	let result = await Media.create(body)
	ctx.resHandle('0000', true)
}
// 更新媒体
async function update(ctx, next) {
	let { params, request } = ctx,
		{ body } = request
	let result = await Media.update(body, { where: { id: params.id } })
	ctx.resHandle('0000', result)
}

// 上传媒体
async function upload(ctx, next) {
	let { body, files: { file } } = ctx.request,
		{ hash, path } = file,
		code = salt(hash)
	let data  = JSON.stringify({ ...body, path })
	let exist = await redis.exists(code)
	let info  = await getMediaInfo(path)
	if (exist) {
		fs.unlinkSync(path)
		return ctx.resHandle('0000', info)
	}
	await redis.rpush('task_queue', code)
	await redis.set(code, data)
	await Media.update({ status: 2, hash, code }, { where: { id: body.parentId } })
	ctx.resHandle('0000', info)
}

async function video(ctx, next) {
	let { params, request } = ctx,
		{ hash, quality, name } = params,
		{ query } = request,
		{ s, e }  = query,
		dir = `${__encode}/${hash}/${quality}/${name}`
	let exist = await fs.existsSync(dir)
	if (!exist) return ctx.resHandle('9999')
	// ctx.set('Content-Type', 'video/mp4')
	ctx.set('Cache-Control', 'private, max-age=86400')
	ctx.body = fs.createReadStream(dir, { start: +s, end: +e })
}

module.exports = {
	list,
	create,
	update,
	detail,
	upload,
	video,
}

