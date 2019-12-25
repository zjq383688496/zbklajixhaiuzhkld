const fs = require('fs')
const { __tmp, sbin } = require('../config')
const { exec } = require('child_process')

module.exports = {
    getMediaInfo,
    saveMedia,
}

function saveMedia({ hash, name, path, size, type }) {
    return new Promise((resolve, reject) => {
        const targetDir = `${__tmp}/${hash}`,
            target = `${targetDir}/${name}`
        fs.mkdir(targetDir, { recursive: true }, err => {
            fs.copyFileSync(path, target)
            resolve({ hash, name, path: target, size, type })
        })
    })
}

// 获取媒体信息
function getMediaInfo(path) {
    return new Promise((resolve, reject) => {
        exec(`${sbin.ffprobe} -v quiet -show_format -show_streams -print_format json ${path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行的错误: ${error}`)
                return resolve()
            }
            var str = mediaInfoFormat(JSON.parse(stdout))
            resolve(str)
        })
    })
}


function mediaInfoFormat(data) {
    let { format, streams } = data,
        { bit_rate, duration, size } = format,
        newData = { format, video: null, audio: null }
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
            if (!newData.audio) newData.audio = stream
            return
        }
        if (stream.codec_type !== 'video') return

        if (newData.video) return
        newData.video = stream
        
		let { coded_width, coded_height, duration, width, height, display_aspect_ratio, r_frame_rate, sample_aspect_ratio } = stream

        duration = +duration

		let pixel_aspect_ratio = eval(sample_aspect_ratio.replace(':', '/')),	// 采样像素(宽高)比
			size_aspect_ratio  = eval(display_aspect_ratio.replace(':', '/')),	// 视频宽高比
            original_width     = ~~(coded_width * pixel_aspect_ratio),			// 原始宽
            frame_rate         = eval(r_frame_rate)                             // 帧数/s

        let c_width  = ~~(coded_width * pixel_aspect_ratio),
			c_height = coded_height,
			_width   = ~~(width * pixel_aspect_ratio),
			_height  = height,
			c_ratio  = size_aspect_ratio - c_width / c_height,
            _ratio   = size_aspect_ratio - _width / _height

		// 添加新属性
		Object.assign(stream, {
            duration,
            frame_rate,							                    // 帧速率
			frames: duration * frame_rate,                          // 帧总数
			pixel_aspect_ratio,										// 像素比
			size_aspect_ratio,										// 尺寸比
			original_width:  c_ratio < _ratio? c_width:  _width,	// 原始宽
			original_height: c_ratio < _ratio? c_height: _height,	// 原始高
		})
        stream.pixel_total = stream.original_width * stream.original_height		// 帧像素数
	})

	return newData
}