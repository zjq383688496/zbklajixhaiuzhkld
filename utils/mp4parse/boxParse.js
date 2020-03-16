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

		// console.log('type: ', type)
		// if (type === 'sidx') {
		// 	debugger
		// }
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
			// else {
			// 	debugger
			// }
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
export default BoxParse