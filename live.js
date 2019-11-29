const fs = require('fs')
const { mysql } = require('./utils')
const { path }  = require('./config')
const { exec, spawn } = require('child_process')
const { resource } = path

const LIVE = global.LIVE = {}

module.exports = live

let ids = [],
	liveIdx = 0,
	resIdx  = 0,
	ID
async function live() {
	await getList()
	var { name, data } = await getListById(ID)
	play(data, name)
}

async function getList() {
	let { results } = await mysql.query(`SELECT * FROM rtmp.live LIMIT 0,1000`)
	ids = results.map(result => result.id)
	resIdx = 0
	ID  = ids[liveIdx]
}

function getListById(id) {
	return new Promise(async res => {
		var { err, results } = await mysql.query(`SELECT * FROM rtmp.live WHERE id=${id}`),
			parent     = results[0],
			parentPath = parent.path,
			{ err, results } = await mysql.query(`SELECT * FROM rtmp.resource WHERE parentId=${id} LIMIT 0,100`)

		res({
			...parent,
			data: results.map(_ => {
				_.path = `${resource}/${parentPath}/${_.path}`
				return _
			})
		})
	})
}

async function play(list, name, index = 0) {
	var video = list[index]
	if (!video) {
		++liveIdx
		if (liveIdx >= ids.length) liveIdx = 0
		ID = ids[liveIdx]
		return await live()
	}

	// 更新当前信息
	LIVE.currentInfo = { data: list, name, subname: video.name }
	if (global.WS.upClient) global.WS.upClient.send(JSON.stringify(LIVE.currentInfo))
	
	// setTimeout(() => {
	// 	play(list, name, ++index)
	// }, 5000)
	
	
	var dir  = video.path,
		size = video.size

	console.log('正在播放: ', name, video.name)

	var cmd     = '/Users/zhuangjiaqi/tools/ffmpeg/bin/ffmpeg'
	var ipt     = `-re -i ${dir} -s ${size} `
	var out     = ' -f flv rtmp://localhost:10086/hls'
	var encoder = '-c:v libx264 -profile:v baseline -level 3 -preset medium -b:v 500k -c:a aac -b:a 32k'

	const ffmpeg = spawn('ffmpeg', (ipt + encoder + out).split(/\s+/), { cwd: path.ffmpeg })
	ffmpeg.on('close', (code, signal) => {
		console.log(`子进程退出，退出码 ${code}: ${signal}`)
		console.log('播放完成: ', name, video.name)
		play(list, name, ++index)
	})
	ffmpeg.stderr.on('data', data => {})
	ffmpeg.stdout.on('data', data => {})
}
