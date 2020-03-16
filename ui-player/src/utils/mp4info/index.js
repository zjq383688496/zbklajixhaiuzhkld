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
	let { stream, sidx } = this,
		{ entrys, timescale } = sidx,
		position  = stream.getPosition(),
		fragments = [],
		startTime = 0

	entrys.forEach(({ referenced_size, subsegment_duration }) => {
		let duration = subsegment_duration / timescale,
			start    = position + 1
		position += referenced_size
		let data = {
			duration,
			start,
			end: position,
			startTime,
		}
		fragments.push(data)
		startTime += duration
		data.endTime = startTime
	})
	this.fragments = fragments
}


class Mp4parse {
	constructor(buffer) {
		let stream = this.stream = new DataBuffer(buffer)
		parse.bind(this, stream)()
		getInfo.bind(this)()
	}
}

export default Mp4parse