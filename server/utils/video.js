const fs = require('fs')
const { redis, sequelize } = global
const { __tmp, __encode, sbin } = require('../config')
const { exec, spawn } = require('./child_process')
const mkdir = require('./mkdir')

module.exports = {
	getMediaInfo,
	// saveMedia,
	trackSeparate,
}

// 获取媒体信息
function getMediaInfo(path) {
	return new Promise(async (resolve, reject) => {
		let stdout = await exec(`${sbin.ffprobe} -v quiet -show_format -show_streams -print_format json ${path}`)
		var str = mediaInfoFormat(JSON.parse(stdout))
		resolve(str)
	})
}


function mediaInfoFormat(data) {
	let { format, streams } = data,
		{ bit_rate, duration, size } = format,
		newData = { format, video: null, audio: [] }
	// format相关字段处理成number
	Object.assign(format, {
		bit_rate: +bit_rate,
		duration: +duration,
		size:     +size
	})

	// 比特率处理成number
	streams.forEach(stream => {
		let { bit_rate, coded_width, coded_height, width, height, duration, r_frame_rate } = stream
		
		if (stream.codec_type === 'audio') newData.audio.push(stream)
		bit_rate = +bit_rate
		duration = +duration

		Object.assign(stream, { bit_rate, duration })
		if (stream.codec_type !== 'video') return
		newData.video = stream
		let frame_rate = eval(r_frame_rate)                             // 帧数/s

		// 添加新属性
		Object.assign(stream, {
			frame_rate,							                    // 帧速率
			frames: duration * frame_rate,                          // 帧总数
			px_bit: coded_width * coded_height * frame_rate / bit_rate,
			size_aspect_ratio: width / height,
		})
	})

	return newData
}

// 轨道分离
function trackSeparate({ audio, video }, path, hash) {
	return new Promise(async resolve => {
		let outputDir = `${__encode}/${hash}/original`
		let $audio = [], tracks = { video: '', audio: $audio }
		let idx = 0
		await mkdir(outputDir)
		while(true) {
			let _audio = audio[idx]
			if (!_audio) break
			let a = await separateAudio(path, idx, outputDir)
			$audio.push(a)
			++idx
		}
		tracks.video = await separateVideo(path, outputDir)
		resolve(tracks)
	})
}

function separateVideo(path, outputDir) {
	return new Promise(async resolve => {
		let output = `${outputDir}/v.mp4`
		await spawn(sbin.ffmpeg, `-y -i ${path} -c:v copy -an ${output}`)
		resolve(output)
	})
}

function separateAudio(path, trackId, outputDir) {
	return new Promise(async resolve => {
		let output = `${outputDir}/a_${trackId}.m4a`
		await spawn(sbin.ffmpeg, `-y -i ${path} -map 0:${trackId + 1} -c:a copy -vn ${output}`)
		resolve(output)
	})
}