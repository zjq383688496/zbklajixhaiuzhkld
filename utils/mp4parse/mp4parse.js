(function() {
	
let MAX_SIZE = Math.pow(2, 32)
class DataBuffer {
	constructor(arrayBuffer) {
		this._buffer     = arrayBuffer
		this._byteLength = arrayBuffer.byteLength
		this._dataView   = new DataView(arrayBuffer, 0)
		this.position    = 0
		arrayBuffer.usedBytes = 0
	}

	getPosition()    { return this.position }
	getEndPosition() { return this._byteLength }

	readInt(bit) {
		var v = this._dataView[`getInt${bit}`](this.position)
		this.position += bit / 8
		return v
	}
	readInt16() { return this.readInt(16) }
	readInt32() { return this.readInt(32) }
	
	readInt32Array(length) {
		var arr = new Int32Array(length)
		DataStream.memcpy(arr.buffer, 0, this._buffer, this.position, length * arr.BYTES_PER_ELEMENT)
		this.position += arr.byteLength
		return arr
	}
	readUint(bit) {
		var v = this._dataView[`getUint${bit}`](this.position)
		this.position += bit / 8
		return v
	}
	readUint8()  { return this.readUint(8) }
	readUint16() { return this.readUint(16) }
	readUint24() { return (this.readUint8() << 16) + (this.readUint8() << 8) + this.readUint8() }
	readUint32() { return this.readUint(32) }
	readUint64() { return (this.readUint32() * MAX_SIZE) + this.readUint32() }
	
	/* readUint相关方法 */
	readUintArray(bit, length) {
		var arr = new window[`Uint${bit}Array`](length)
		this.memcpy(arr.buffer, 0, this._buffer, this.position, length * arr.BYTES_PER_ELEMENT)
		this.position += arr.byteLength
		return arr
	}
	readUint8Array(length)  { return this.readUintArray(8, length) }
	readUint16Array(length) { return this.readUintArray(16, length) }
	readUint32Array(length) { return this.readUintArray(32, length) }
	readString(length) { return String.fromCharCodeUint8.apply(null, [this.mapUint8Array(length)]) }
	mapUint8Array(length) {
		var arr = new Uint8Array(this._buffer, this.position, length)
		this.position += length * 1
		return arr
	}
	memcpy(dst, dstOffset, src, srcOffset, byteLength) {
		var dstU8 = new Uint8Array(dst, dstOffset, byteLength)
		var srcU8 = new Uint8Array(src, srcOffset, byteLength)
		dstU8.set(srcU8)
	}
	addUsedBytes(nbBytes) { this._buffer.usedBytes += nbBytes }
	seek(filePosition)    { this.position = filePosition }
}

const sampleMap = {
	avc1: 1,
	mp4a: 1,
}

const BoxParse = {
	parseOneBox(stream, headerOnly, parentSize) {
		let start = stream.getPosition(),
			header_size = 8,
			diff

		if (stream.getEndPosition() - start < 8) return { code: 0 }
		
		let size = stream.readUint32(),
			type = stream.readString(4)

		if (headerOnly) return { code: 1, type, size, header_size, start }

		let box = new Box(type, size)
		
		box.header_size = header_size
		box.start       = start

		console.log('type: ', type)
		if (type === 'sidx') {
			debugger
		}
		box.parseDataAndRewind(stream)
		// if (!box.parse) {
		// 	debugger
		// }
		box.parse(stream)
		
		diff = stream.getPosition() - start - size
		if (diff > 0) {
			// console.error(`BoxParse Parsing of box ${type} read ${diff} more bytes than the indicated box data size, seeking backwards`)
			stream.seek(start + size)
		}
		delete box.start
		return { code: 1, box, size }
	},
	parseHeader(stream) {
		stream.readUint8Array(6)
		this.data_reference_index = stream.readUint16()
		this.header_size += 8
	},
	parseFullHeader(stream) {
		/*this.version = */stream.readUint8()
		/*this.flags = */stream.readUint24()
		this.header_size += 4
	},
	parseLanguage(stream) {
		let language = stream.readUint16()
		var chars = []
		chars[0] = (language >> 10) & 0x1F
		chars[1] = (language >> 5) & 0x1F
		chars[2] = (language) & 0x1F
		this.language = String.fromCharCode(chars[0] + 0x60, chars[1] + 0x60, chars[2] + 0x60)
	},
	parseFooter(stream) {
		while (stream.getPosition() < this.start + this.size) {
			let result = BoxParse.parseOneBox(stream, false)
			let { code, box } = result
			if (code) this[box.type] = box
			else {
				debugger
			}
		}	
	},
	ftypBox(stream) {
		var toparse = this.size - this.header_size
		this.major_brand = stream.readString(4)
		this.minor_version = stream.readUint32()
		toparse -= 8
		this.compatible_brands = []
		var i = 0
		while (toparse >= 4) {
			this.compatible_brands[i] = stream.readString(4)
			toparse -= 4
			i++
		}
	},
	mvhdBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		stream.readUint32()
		stream.readUint32()
		this.timescale = stream.readUint32()
		this.duration  = stream.readUint32()
		stream.readUint32()
		stream.readUint16() >> 8
		stream.readUint16()
		stream.readUint32Array(2)
		stream.readUint32Array(9)
		stream.readUint32Array(6)
		stream.readUint32()
	},
	tkhdBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		stream.readUint32()
		stream.readUint32()
		this.id = stream.readUint32()
		stream.readUint32()
		this.duration = stream.readUint32()
		stream.readUint32Array(2)
		this.layer = stream.readInt16()
		this.alternate_group = stream.readInt16()
		this.volume = stream.readInt16() >> 8
		stream.readUint16()
		this.matrix = stream.readInt32Array(9)
		this.width = stream.readUint32()
		this.height = stream.readUint32()
	},
	elstBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.entries = []
		let entry_count = stream.readUint32()
		for (let i = 0; i < entry_count; i++) {
			let entry = {}
			this.entries.push(entry)
			entry.segment_duration = stream.readUint32()
			entry.media_time = stream.readInt32()
			entry.media_rate = stream.readInt16()
			stream.readInt16()
		}
	},
	mdhdBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		stream.readUint32()
		stream.readUint32()
		this.timescale = stream.readUint32()
		this.duration  = stream.readUint32()
		BoxParse.parseLanguage.bind(this, stream)()
		stream.readUint16()
	},
	hdlrBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		stream.readUint32()
		this.handler_type = stream.readString(4)
		stream.readUint32Array(3)
		this.handler_name = stream.readString(this.size - this.header_size - 20)
	},
	vmhdBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.graphicsmode = stream.readUint16()
		this.opcolor = stream.readUint16Array(3)
	},
	drefBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.entries = []
		var entry_count = stream.readUint32()
		for (let i = 0; i < entry_count; i++) {
			let result = BoxParse.parseOneBox(stream, false)
			let { box } = result
			this.entries.push(box)
		}
	},
	stsdBox(stream) {
		this.entries = []
		BoxParse.parseFullHeader.bind(this, stream)()
		let entryCount = stream.readUint32()
		for (let i = 1; i <= entryCount; i++) {
			let result = BoxParse.parseOneBox(stream, true)
			let { type, size, header_size, start } = result
			if (sampleMap[type]) {
				box = new Box(type, size)
				box.header_size = header_size
				// box.start = start
			}
			box.parseDataAndRewind(stream)
			box.parse(stream)
			this.entries.push(box)
		}
	},
	"url Box"(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
	},
	avcCBox(stream) {
		var i, nb_nalus, length, toparse
		this.configurationVersion  = stream.readUint8()
		this.AVCProfileIndication  = stream.readUint8()
		this.profile_compatibility = stream.readUint8()
		this.AVCLevelIndication = stream.readUint8()
		this.lengthSizeMinusOne = (stream.readUint8() & 0x3)
		nb_nalus = (stream.readUint8() & 0x1F)
		toparse = this.size - this.header_size - 6
		this.SPS = new Array(nb_nalus) 
		for (i = 0; i < nb_nalus; i++) {
			length = stream.readUint16()
			this.SPS[i] = stream.readUint8Array(length)
			toparse -= 2 + length
		}
		nb_nalus = stream.readUint8()
		toparse--
		this.PPS = new Array(nb_nalus)
		for (i = 0; i < nb_nalus; i++) {
			length = stream.readUint16()
			this.PPS[i] = stream.readUint8Array(length)
			toparse -= 2 + length
		}
	},
	sttsBox(stream) {
		var entry_count, i, delta
		BoxParse.parseFullHeader.bind(this, stream)()
		entry_count = stream.readUint32()
		this.sample_counts = []
		this.sample_deltas = []
		for(i = 0; i < entry_count; i++) {
			this.sample_counts.push(stream.readUint32())
			delta = stream.readInt32()
			if (delta < 0) delta = 1
			this.sample_deltas.push(delta)
		}
	},
	stscBox(stream) {
		var entry_count, i
		BoxParse.parseFullHeader.bind(this, stream)()
		entry_count = stream.readUint32()
		this.first_chunk = []
		this.samples_per_chunk = []
		this.sample_description_index = []
		for(i = 0; i < entry_count; i++) {
			this.first_chunk.push(stream.readUint32())
			this.samples_per_chunk.push(stream.readUint32())
			this.sample_description_index.push(stream.readUint32())
		}
	},
	stszBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.sample_size  = stream.readUint32()
		this.sample_count = stream.readUint32()
		stream.readUint32Array(this.sample_count)
	},
	stcoBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		let entry_count = stream.readUint32()
		stream.readUint32Array(entry_count)
	},
	mehdBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.fragment_duration = stream.readUint64()
	},
	smhdBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		stream.readUint8Array(this.size - this.header_size)
	},
	trexBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.track_id = stream.readUint32()
		this.default_sample_description_index = stream.readUint32()
		this.default_sample_duration = stream.readUint32()
		this.default_sample_size = stream.readUint32()
		this.default_sample_flags = stream.readUint32()
	},
	sidxBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		this.reference_ID = stream.readUint32()
		this.timescale = stream.readUint32()
		this.earliest_presentation_time = stream.readUint32()
		this.first_offset = stream.readUint32()
		stream.readUint16()
		this.entrys = []
		var count = stream.readUint16()
		for (var i = 0; i < count; i++) {
			var ref = {}
			this.entrys.push(ref)
			var tmp_32 = stream.readUint32()
			ref.reference_type  = (tmp_32 >> 31) & 0x1
			ref.referenced_size = tmp_32 & 0x7FFFFFFF
			ref.subsegment_duration = stream.readUint32()
			tmp_32 = stream.readUint32()
			ref.starts_with_SAP = (tmp_32 >> 31) & 0x1
			ref.SAP_type = (tmp_32 >> 28) & 0x7
			ref.SAP_delta_time = tmp_32 & 0xFFFFFFF
		}
	},
	esdsBox(stream) {
		BoxParse.parseFullHeader.bind(this, stream)()
		stream.readUint8Array(this.size - this.header_size)
	},
	avc1Box(stream) {
		BoxParse.parseHeader.bind(this, stream)()
		stream.readUint16()
		stream.readUint16()
		stream.readUint32Array(3)
		this.width = stream.readUint16()
		this.height = stream.readUint16()
		this.horizresolution = stream.readUint32()
		this.vertresolution = stream.readUint32()
		stream.readUint32()
		this.frame_count    = stream.readUint16()
		this.compressorname = stream.readString(32)
		this.depth = stream.readUint16()
		stream.readUint16()
		BoxParse.parseFooter.bind(this, stream)()
	},
	mp4aBox(stream) {
		BoxParse.parseHeader.bind(this, stream)()
		stream.readUint32Array(2)
		this.channel_count = stream.readUint16()
		this.samplesize    = stream.readUint16()
		stream.readUint16()
		stream.readUint16()
		this.samplerate = (stream.readUint32() / (1 << 16))
		BoxParse.parseFooter.bind(this, stream)()
	},
	ContainerBox(stream) {
		while (stream.getPosition() < this.start + this.size) {
			let result = BoxParse.parseOneBox(stream, false)
			let { box } = result
			let { type } = box
			if (type === 'trex' || type === 'trak') {
				if (!this[`${type}s`]) this[`${type}s`] = []
				this[`${type}s`].push(box)
			} else {
				this[type] = box
			}
		}
	}
}

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

window.Mp4parse = Mp4parse

}());
