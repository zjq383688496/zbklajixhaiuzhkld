const fs = require('fs')
const { __tmp, __encode, sbin } = require('../config')
const { exec, spawn } = require('./child_process')

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
		stream.bit_rate = +stream.bit_rate

		if (stream.codec_type === 'audio') {
			newData.audio.push(stream)
		}
		if (stream.codec_type !== 'video') return

		newData.video = stream
		
		let { bit_rate, coded_width, coded_height, duration, width, height, display_aspect_ratio, r_frame_rate, sample_aspect_ratio } = stream

		duration = +duration

		let frame_rate = eval(r_frame_rate)                             // 帧数/s

		// 添加新属性
		Object.assign(stream, {
			duration,
			frame_rate,							                    // 帧速率
			frames: duration * frame_rate,                          // 帧总数
			px_bit: coded_width * coded_height * frame_rate / bit_rate
		})
	})

	return newData
}

// 轨道分离
function trackSeparate({ fotmat, audio, video }, path, hash) {
	let output = `${__encode}/hash`
	return new Promise(resolve => {
		// let 
		// Promise.all([

		// ])
		debugger
	})
}

function separateVideo(path) {
	return new Promise(resolve => {

	})
}