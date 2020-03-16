import DataBuffer from './dataBuffer'
import BoxParse   from './boxParse'
import Box        from './box'

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

class Mp4parse {
	constructor(buffer) {
		let stream = this.stream = new DataBuffer(buffer)
		parse.bind(this, stream)()
	}
}

export default Mp4parse