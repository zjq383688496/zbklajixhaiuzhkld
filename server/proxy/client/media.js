const { redis, sequelize } = global
const fs = require('fs')
const { __encode } = require('../../config')
const { Media, Video, Audio } = sequelize
const { getMediaInfo } = require('../../utils/video')
const { salt, encrypt, decrypt } = require('../../utils/crypto')


// 获取媒体列表
async function list(ctx, next) {
	let result = await Media.findAll({ attributes: { exclude: ['userId', 'hash', 'code'] } })
	if (result && result.length >= 0) ctx.resHandle('0000', result)
}

// 获取媒体信息
async function detail(ctx, next) {
	let { host, params } = ctx,
		{ code } = params
	if (!code) return ctx.resHandle('0002')
	let result = await Media.findOne({ where: { code }, attributes: ['code', 'title', 'description', 'type', 'frozen', 'status'] })
	if (!result) return ctx.resHandle('0001', result)
	let parentCode = code
	let videos = await Video.findAll({ where: { parentCode }, attributes: ['mimeType', 'initRange', 'fps', 'bitrate', 'duration', 'size', 'width', 'height', 'quality', 'url'] })
	let audios = await Audio.findAll({ where: { parentCode }, attributes: ['mimeType', 'initRange', 'bitrate', 'duration', 'size', 'quality', 'trackId', 'language', 'url'] })
	// videos = videos.filter(item => item.url)
	// audios = audios.filter(item => item.url)
	videos = videos.filter(item => {
		let { url } = item
		if (!url) return false
		item.url = `//${host}/client/video/${code}/${encrypt(url)}`
		return url
	})
	audios = audios.filter(item => {
		let { url } = item
		if (!url) return false
		item.url = `//${host}/client/video/${code}/${encrypt(url)}`
		return url
	})
	result.dataValues.streams = JSON.parse(JSON.stringify([ ...videos, ...audios ]))
	ctx.resHandle('0000', result.dataValues)
}

async function video(ctx, next) {
	let { params, request } = ctx,
		{ code, url } = params,
		{ query } = request,
		{ s, e }  = query,
		dir
	url = decrypt(url)
	dir = `${__encode}/${code}${url}`
	let exist = await fs.existsSync(dir)
	if (!exist) return ctx.resHandle('9999')
	// ctx.set('Content-Type', 'video/mp4')
	ctx.set('Cache-Control', 'private, max-age=86400')
	ctx.body = fs.createReadStream(dir, { start: +s, end: +e })
}

module.exports = {
	list,
	detail,
	video,
}

