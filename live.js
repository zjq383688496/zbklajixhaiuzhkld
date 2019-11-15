const fs = require('fs')
const { mysql } = require('./utils')
const { path }  = require('./config')
const { exec, spawn } = require('child_process')
const { resource } = path

module.exports = live

let ID = 1
async function live() {
	var { name, data } = await getList(ID)
	console.log(name, data)
	play(data, name)
}

function getList(id) {
	return new Promise(async res => {
		var { err, results } = await mysql.query(`SELECT * FROM rtmp.live WHERE id=${id}`),
			parent     = results[0],
			parentPath = parent.path,
			{ err, results } = await mysql.query(`SELECT * FROM rtmp.resource WHERE parentId=${id} LIMIT 0, 100`)

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
		++ID
		if (ID > 3) ID = 1
		return await live()
	}
	var dir  = video.path,
		size = video.size
	console.log('正在播放: ', name, video.name)
	var cmd = '/Users/zhuangjiaqi/tools/ffmpeg/bin/ffmpeg'
	// var ipt = `-re -i ${dir} -r 15 -s ${size} `
	var ipt = `-re -i ${dir} -s ${size} `
	var out = ' -f flv rtmp://localhost:10086/hls'
	var encoder = '-c:v libx264 -profile:v baseline -level 3 -preset medium -b:v 500k -c:a aac -b:a 32k'
	
	console.log(`${cmd} ` + ipt + encoder + out)

	const ffmpeg = spawn('ffmpeg', (ipt + encoder + out).split(/\s+/), { cwd: path.ffmpeg })

	ffmpeg.stderr.on('data', data => {
		// console.log(data)
	})
	ffmpeg.stdout.on('data', data => {
		// console.log(data)
	})
	ffmpeg.on('close', (code, signal) => {
		console.log(`子进程退出，退出码 ${code}: ${signal}`)
		console.log('播放完成: ', name, video.name)
		play(list, name, ++index)
	})
}
