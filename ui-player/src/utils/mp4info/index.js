import DataBuffer from './dataBuffer'
import BoxParse   from './boxParse'

// 解析数据
function parse(stream) {
	while (true) {
		let result = BoxParse.parseOneBox(stream)
		let { code, box } = result
		if (!code) return
		let { type } = box
		this[type] = box
		stream.addUsedBytes(box.size)
	}
}

// 获取视频信息
function getInfo() {
	let { stream, sidx, moov: { mvhd } } = this,
		{ entrys, timescale } = sidx,
		position  = stream.getPosition(),
		fragments = this.fragments = [],
		startTime = 0

	entrys.forEach(({ referenced_size, subsegment_duration }) => {
		let duration = subsegment_duration / timescale,
			start    = position + 1
		position += referenced_size
		let data = {
			range: {
				start,
				end: position
			},
			time: {
				start: startTime,
			},
			duration,
		}
		fragments.push(data)
		startTime += duration
		data.time.end = startTime
	})
	this.fragment_count = fragments.length
	this.duration = mvhd.duration / mvhd.timescale
}


class Mp4parse {
	constructor(buffer) {
		let stream = this.stream = new DataBuffer(buffer)
		parse.bind(this, stream)()
		getInfo.bind(this)()
	}
	getFragments(time, amount = 1) {
		let { duration, fragments, fragment_count } = this,
			initIdx  = time / duration * fragment_count >> 0,
			playlist
		function getIndex(idx) {
			let { time: { start, end } } = fragments[idx]
			if (time >= start && time < end) return idx
			else if (time < start) return getIndex(--idx)
			else return getIndex(++idx)
		}
		initIdx  = getIndex(initIdx)
		playlist = fragments.slice(initIdx, initIdx + amount)
		return playlist
	}
}

export default Mp4parse