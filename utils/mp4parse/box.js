let ContainerBoxMap = {
	moov: 1,
	trak: 1,
	edts: 1,
	mdia: 1,
	minf: 1,
	dinf: 1,
	stbl: 1,
	mvex: 1,
}
class Box {
	constructor(type, size) {
		this.type  = type
		this.size  = size
		let parse = BoxParse[`${type}Box`]
		if (parse) this.parse = BoxParse[`${type}Box`].bind(this)
		else if (ContainerBoxMap[type]) {
			this.parse = BoxParse.ContainerBox.bind(this)
		}
	}
	parseDataAndRewind(stream) {
		stream.readUint8Array(this.size - this.header_size)
		stream.position -= this.size - this.header_size
	}
}
export default Box