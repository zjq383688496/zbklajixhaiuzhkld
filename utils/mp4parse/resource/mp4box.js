// file:src/DataStream.js
var DataStream = function(arrayBuffer, byteOffset) {
	this._byteOffset = byteOffset || 0;
	if (arrayBuffer instanceof ArrayBuffer) {
		this.buffer = arrayBuffer;
	} else if (typeof arrayBuffer == "object") {
		this.dataView = arrayBuffer;
		if (byteOffset) {
			this._byteOffset += byteOffset;
		}
	} else {
		this.buffer = new ArrayBuffer(arrayBuffer || 0);
	}
	this.position = 0;
};
DataStream.prototype = {};

DataStream.prototype.getPosition = function() {
	return this.position;
}

DataStream.prototype._trimAlloc = function() {
	if (this._byteLength == this._buffer.byteLength) {
		return;
	}
	var buf = new ArrayBuffer(this._byteLength);
	var dst = new Uint8Array(buf);
	var src = new Uint8Array(this._buffer, 0, dst.length);
	dst.set(src);
	this.buffer = buf;
};

DataStream.prototype._byteLength = 0;

Object.defineProperty(DataStream.prototype, 'byteLength',
	{ get: function() {
		return this._byteLength - this._byteOffset;
	}});

Object.defineProperty(DataStream.prototype, 'buffer',
	{ get: function() {
			this._trimAlloc();
			return this._buffer;
		},
		set: function(v) {
			this._buffer = v;
			this._dataView = new DataView(this._buffer, this._byteOffset);
			this._byteLength = this._buffer.byteLength;
		} });

Object.defineProperty(DataStream.prototype, 'byteOffset',
	{ get: function() {
		return this._byteOffset;
	},
	set: function(v) {
		this._byteOffset = v;
		this._dataView = new DataView(this._buffer, this._byteOffset);
		this._byteLength = this._buffer.byteLength;
	} });

Object.defineProperty(DataStream.prototype, 'dataView',
	{ get: function() {
		return this._dataView;
	},
	set: function(v) {
		this._byteOffset = v.byteOffset;
		this._buffer = v.buffer;
		this._dataView = new DataView(this._buffer, this._byteOffset);
		this._byteLength = this._byteOffset + v.byteLength;
	} });

DataStream.prototype.isEof = function() {
	return (this.position >= this._byteLength);
};

DataStream.prototype.mapUint8Array = function(length) {
	var arr = new Uint8Array(this._buffer, this.byteOffset+this.position, length);
	this.position += length * 1;
	return arr;
};

DataStream.prototype.readInt32Array = function(length) {
	var arr = new Int32Array(length);
	DataStream.memcpy(arr.buffer, 0,
		this.buffer, this.byteOffset+this.position,
		length*arr.BYTES_PER_ELEMENT)
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readInt16Array = function(length) {
	var arr = new Int16Array(length);
	DataStream.memcpy(arr.buffer, 0,
		this.buffer, this.byteOffset+this.position,
		length*arr.BYTES_PER_ELEMENT)
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readInt8Array = function(length) {
	length = length == null ? (this.byteLength-this.position) : length;
	var arr = new Int8Array(length);
	DataStream.memcpy(arr.buffer, 0,
		this.buffer, this.byteOffset+this.position,
		length*arr.BYTES_PER_ELEMENT);
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readUint32Array = function(length) {
	length = length == null ? (this.byteLength-this.position / 4) : length;
	var arr = new Uint32Array(length);
	DataStream.memcpy(arr.buffer, 0,
		this.buffer, this.byteOffset+this.position,
		length*arr.BYTES_PER_ELEMENT)
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readUint16Array = function(length) {
	length = length == null ? (this.byteLength-this.position / 2) : length;
	var arr = new Uint16Array(length);
	DataStream.memcpy(arr.buffer, 0,
		this.buffer, this.byteOffset+this.position,
		length*arr.BYTES_PER_ELEMENT)
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readUint8Array = function(length) {
	var arr = new Uint8Array(length);
	DataStream.memcpy(arr.buffer, 0,
		this.buffer, this.byteOffset+this.position,
		length*arr.BYTES_PER_ELEMENT);
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readFloat64Array = function(length) {
	length = length == null ? (this.byteLength-this.position / 8) : length;
	var arr = new Float64Array(length);
	DataStream.memcpy(arr.buffer, 0,
										this.buffer, this.byteOffset+this.position,
										length*arr.BYTES_PER_ELEMENT)
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readFloat32Array = function(length) {
	length = length == null ? (this.byteLength-this.position / 4) : length;
	var arr = new Float32Array(length);
	DataStream.memcpy(arr.buffer, 0,
										this.buffer, this.byteOffset+this.position,
										length*arr.BYTES_PER_ELEMENT);
	this.position += arr.byteLength;
	return arr;
};

DataStream.prototype.readInt32 = function() {
	var v = this._dataView.getInt32(this.position);
	this.position += 4;
	return v;
};

DataStream.prototype.readInt16 = function() {
	var v = this._dataView.getInt16(this.position);
	this.position += 2;
	return v;
};

DataStream.prototype.readInt8 = function() {
	var v = this._dataView.getInt8(this.position)
	this.position += 1
	return v
};

DataStream.prototype.readUint32 = function() {
	var v = this._dataView.getUint32(this.position)
	this.position += 4
	return v
};

DataStream.prototype.readUint16 = function() {
	var v = this._dataView.getUint16(this.position)
	this.position += 2
	return v
};

DataStream.prototype.readUint8 = function() {
	var v = this._dataView.getUint8(this.position)
	this.position += 1
	return v
};

DataStream.prototype.readFloat32 = function() {
	var v = this._dataView.getFloat32(this.position);
	this.position += 4
	return v
};

DataStream.prototype.readFloat64 = function() {
	var v = this._dataView.getFloat64(this.position);
	this.position += 8;
	return v;
};

DataStream.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

DataStream.memcpy = function(dst, dstOffset, src, srcOffset, byteLength) {
	var dstU8 = new Uint8Array(dst, dstOffset, byteLength);
	var srcU8 = new Uint8Array(src, srcOffset, byteLength);
	dstU8.set(srcU8);
}

DataStream.prototype.failurePosition = 0;

String.fromCharCodeUint8 = function(uint8arr) {
		var arr = [];
		for (var i = 0; i < uint8arr.length; i++) {
			arr[i] = uint8arr[i];
		}
		return String.fromCharCode.apply(null, arr);
}

DataStream.prototype.readString = function(length) {
	return String.fromCharCodeUint8.apply(null, [this.mapUint8Array(length)]);
};

DataStream.prototype.readCString = function(length) {
	var blen = this.byteLength-this.position;
	var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
	var len = blen;
	if (length != null) {
		len = Math.min(length, blen);
	}
	for (var i = 0; i < len && u8[i] !== 0; i++)
	var s = String.fromCharCodeUint8.apply(null, [this.mapUint8Array(i)]);
	if (length != null) {
		this.position += len-i;
	} else if (i != blen) {
		this.position += 1;
	}
	return s;
};

var MAX_SIZE = Math.pow(2, 32);

DataStream.prototype.readUint64 = function () {
	return (this.readUint32()*MAX_SIZE)+this.readUint32();
}

DataStream.prototype.readUint24 = function () {
	return (this.readUint8()<<16)+(this.readUint8()<<8)+this.readUint8();
}

if (typeof exports !== 'undefined') {
	exports.DataStream = DataStream;  
}


// file:src/buffer.js
var MultiBufferStream = function(buffer) {
	this.buffers = []
	this.bufferIndex = -1
}
MultiBufferStream.prototype = new DataStream(new ArrayBuffer(), 0);

MultiBufferStream.prototype.insertBuffer = function(ab) {	
	var to_add = true;
	for (var i = 0; i < this.buffers.length; i++) {
		var b = this.buffers[i]
	}
	if (to_add) {
		this.buffers.push(ab)
		if (i === 0) {
			this.buffer = ab
		}
	}
}

MultiBufferStream.prototype.cleanBuffers = function () {
	var i
	var buffer
	for (i = 0; i < this.buffers.length; i++) {
		buffer = this.buffers[i]
		if (buffer.usedBytes === buffer.byteLength) {
			this.buffers.splice(i, 1)
			i--
		}
	}
}

MultiBufferStream.prototype.mergeNextBuffer = function() {
	var next_buffer;
	if (this.bufferIndex+1 < this.buffers.length) {
		next_buffer = this.buffers[this.bufferIndex+1];
		if (next_buffer.fileStart === this.buffer.fileStart + this.buffer.byteLength) {
			var oldLength = this.buffer.byteLength;
			var oldUsedBytes = this.buffer.usedBytes;
			var oldFileStart = this.buffer.fileStart;
			this.buffers[this.bufferIndex] = ArrayBuffer.concat(this.buffer, next_buffer);
			this.buffer = this.buffers[this.bufferIndex];
			this.buffers.splice(this.bufferIndex+1, 1);
			this.buffer.usedBytes = oldUsedBytes; /* TODO: should it be += ? */
			this.buffer.fileStart = oldFileStart;
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

MultiBufferStream.prototype.findPosition = function(fromStart, filePosition) {
	var i;
	var abuffer = null;
	var index = -1;

	if (fromStart === true) {
		i = 0
	} else {
		i = this.bufferIndex;
	}

	while (i < this.buffers.length) {
		abuffer = this.buffers[i];
		if (abuffer.fileStart <= filePosition) index = i;
		else break
		i++;
	}

	if (index !== -1) {
		abuffer = this.buffers[index];
		if (abuffer.fileStart + abuffer.byteLength >= filePosition) {
			return index;
		} else {
			return -1;
		}
	} else {
		return -1;
	}
}

MultiBufferStream.prototype.addUsedBytes = function(nbBytes) {
	this.buffer.usedBytes += nbBytes
}

MultiBufferStream.prototype.seek = function(filePosition, fromStart) {
	var index;
	index = this.findPosition(fromStart, filePosition);
	if (index !== -1) {
		this.buffer = this.buffers[index];
		this.bufferIndex = index;
		this.position = filePosition - this.buffer.fileStart;
		return true;
	} else {
		return false;
	}
}

MultiBufferStream.prototype.getPosition = function() {
	return this.buffers[this.bufferIndex].fileStart+this.position;
}

MultiBufferStream.prototype.getLength = function() {
	return this.byteLength;
}

MultiBufferStream.prototype.getEndPosition = function() {
	return this.buffers[this.bufferIndex].fileStart+this.byteLength;
}

// file:src/box.js
var BoxParser = {
	ERR_NOT_ENOUGH_DATA : 0,
	OK : 1,
	boxCodes : [ 
		"avcC", "ftyp",
		"vmhd", "smhd",
	],
	fullBoxCodes : [
		"mvhd", "tkhd", "mdhd", "hdlr", "vmhd", "smhd", "url ", 
		"stco", "stsc", "stsz", "stts", 
		"mehd", "trex",
		"esds",
		"sidx",
		"elst", "dref",
	],
	containerBoxCodes : [ 
		[ "moov", [ "trak", "sidx" ] ],
		[ "trak" ],
		[ "edts" ],
		[ "mdia" ],
		[ "minf" ],
		[ "dinf" ],
		[ "stbl" ],
		[ "mvex", [ "trex" ] ],
	],
	sampleEntryCodes : [
		{ prefix: "Visual", types: [ "avc1" ] },
		{ prefix: "Audio", 	types: [ "mp4a" ] },
	],
	initialize: function() {
		var i, j;
		var length;
		BoxParser.FullBox.prototype = new BoxParser.Box();
		BoxParser.ContainerBox.prototype = new BoxParser.Box();
		length = BoxParser.boxCodes.length;
		for (i=0; i<length; i++) {
			BoxParser[BoxParser.boxCodes[i]+"Box"] = (function (j) { /* creating a closure around the iterating value of i */
				return function(size) {
					BoxParser.Box.call(this, BoxParser.boxCodes[j], size);
				}
			})(i);
			BoxParser[BoxParser.boxCodes[i]+"Box"].prototype = new BoxParser.Box();
		}
		/* creating constructors for full boxes */
		length = BoxParser.fullBoxCodes.length;
		for (i=0; i<length; i++) {
			BoxParser[BoxParser.fullBoxCodes[i]+"Box"] = (function (j) { 
				return function(size) {
					BoxParser.FullBox.call(this, BoxParser.fullBoxCodes[j], size);
				}
			})(i);
			BoxParser[BoxParser.fullBoxCodes[i]+"Box"].prototype = new BoxParser.FullBox();
		}
		/* creating constructors for container boxes */
		length = BoxParser.containerBoxCodes.length;
		for (i=0; i<length; i++) {
			BoxParser[BoxParser.containerBoxCodes[i][0]+"Box"] = (function (j, subBoxNames) { 
				return function(size) {
					BoxParser.ContainerBox.call(this, BoxParser.containerBoxCodes[j][0], size);
					if (subBoxNames) {
						this.subBoxNames = subBoxNames;
						var nbSubBoxes = subBoxNames.length;
						for (var k = 0; k<nbSubBoxes; k++) {
							this[subBoxNames[k]+"s"] = [];
						}
					}
				}
			})(i, BoxParser.containerBoxCodes[i][1]);
			BoxParser[BoxParser.containerBoxCodes[i][0]+"Box"].prototype = new BoxParser.ContainerBox();
		}
		/* creating constructors for stsd entries  */
		length = BoxParser.sampleEntryCodes.length;
		for (j = 0; j < length; j++) {
			var prefix = BoxParser.sampleEntryCodes[j].prefix;
			var types = BoxParser.sampleEntryCodes[j].types;
			var nb_types = types.length;
			BoxParser[prefix+"SampleEntry"] = function(type, size) { BoxParser.SampleEntry.call(this, type, size); };
			BoxParser[prefix+"SampleEntry"].prototype = new BoxParser.SampleEntry();
			for (i=0; i<nb_types; i++) {
				BoxParser[types[i]+"SampleEntry"] = (function (k, l) { 
					return function(size) {
						BoxParser[BoxParser.sampleEntryCodes[k].prefix+"SampleEntry"].call(this, BoxParser.sampleEntryCodes[k].types[l], size);
					}
				})(j, i);
				BoxParser[types[i]+"SampleEntry"].prototype = new BoxParser[prefix+"SampleEntry"]();
			}
		}
	},
	Box: function(_type, _size) {
		this.type = _type;
		this.size = _size;
	},
	FullBox: function(type, size) {
		BoxParser.Box.call(this, type, size);
		this.flags = 0;
		this.version = 0;
	},
	ContainerBox: function(type, size) {
		BoxParser.Box.call(this, type, size);
		this.boxes = [];
	},
	SampleEntry: function(type, size, hdr_size, start) {
		BoxParser.Box.call(this, type, size);	
		this.hdr_size = hdr_size;
		this.start = start;
		this.boxes = [];
	}
}

BoxParser.initialize();

if (typeof exports !== "undefined") {
	exports.BoxParser = BoxParser;
}


// file:src/box-parse.js
BoxParser.parseOneBox = function(stream, headerOnly) {
	var box;
	var start = stream.getPosition();
	var hdr_size = 0;
	var diff;
	var uuid;
	if (stream.getEndPosition() - start < 8) return { code: BoxParser.ERR_NOT_ENOUGH_DATA }
	var size = stream.readUint32();
	var type = stream.readString(4);
	hdr_size = 8;

	if (headerOnly) return { code: BoxParser.OK, type, size, hdr_size, start }
	
	if (BoxParser[type+"Box"]) {
		console.log('type: ', type)
		box = new BoxParser[type+"Box"](size);
	} else {
		box = new BoxParser.Box(type, size)
	}

	box.hdr_size = hdr_size;
	box.start = start;
	box.parseDataAndRewind(stream)
	box.parse(stream)
	diff = stream.getPosition() - box.start - box.size
	if (diff > 0) {
		// console.error("BoxParser", "Parsing of box "+box.type+" read "+diff+" more bytes than the indicated box data size, seeking backwards");
		stream.seek(box.start + box.size)
	}
	return { code: BoxParser.OK, box: box, size: box.size };
}

BoxParser.Box.prototype.parse = function(stream) {
	stream.readUint8Array(this.size-this.hdr_size)
	// this.data = stream.readUint8Array(this.size-this.hdr_size);
}

BoxParser.Box.prototype.parseDataAndRewind = function(stream) {
	stream.readUint8Array(this.size-this.hdr_size)
	// this.data = stream.readUint8Array(this.size-this.hdr_size)
	stream.position -= this.size-this.hdr_size;
}

BoxParser.FullBox.prototype.parseDataAndRewind = function(stream) {
	this.parseFullHeader(stream);
	stream.readUint8Array(this.size-this.hdr_size);
	// this.data = stream.readUint8Array(this.size-this.hdr_size);
	this.hdr_size -= 4;
	stream.position -= this.size-this.hdr_size;
}

BoxParser.FullBox.prototype.parseFullHeader = function (stream) {
	this.version = stream.readUint8();
	this.flags = stream.readUint24();
	this.hdr_size += 4;
}

BoxParser.FullBox.prototype.parse = function (stream) {
	this.parseFullHeader(stream);
	stream.readUint8Array(this.size-this.hdr_size);
	// this.data = stream.readUint8Array(this.size-this.hdr_size);
}

BoxParser.ContainerBox.prototype.parse = function(stream) {
	var ret;
	var box;
	while (stream.getPosition() < this.start + this.size) {
		ret = BoxParser.parseOneBox(stream, false)
		box = ret.box;
		this.boxes.push(box)
		if (this.subBoxNames && this.subBoxNames.indexOf(box.type) != -1) {
			this[this.subBoxNames[this.subBoxNames.indexOf(box.type)]+"s"].push(box);
		} else {
			this[box.type] = box;
		}
	}
}

BoxParser.Box.prototype.parseLanguage = function(stream) {
	this.language = stream.readUint16();
	var chars = [];
	chars[0] = (this.language>>10)&0x1F;
	chars[1] = (this.language>>5)&0x1F;
	chars[2] = (this.language)&0x1F;
	this.languageString = String.fromCharCode(chars[0]+0x60, chars[1]+0x60, chars[2]+0x60);
}

// file:src/parsing/avcC.js
BoxParser.avcCBox.prototype.parse = function(stream) {
	var i;
	var nb_nalus;
	var length;
	var toparse;
	this.configurationVersion = stream.readUint8();
	this.AVCProfileIndication = stream.readUint8();
	this.profile_compatibility = stream.readUint8();
	this.AVCLevelIndication = stream.readUint8();
	this.lengthSizeMinusOne = (stream.readUint8() & 0x3);
	nb_nalus = (stream.readUint8() & 0x1F);
	toparse = this.size - this.hdr_size - 6;
	this.SPS = new Array(nb_nalus); 
	for (i = 0; i < nb_nalus; i++) {
		length = stream.readUint16();
		this.SPS[i] = stream.readUint8Array(length);
		toparse -= 2+length;
	}
	nb_nalus = stream.readUint8();
	toparse--;
	this.PPS = new Array(nb_nalus); 
	for (i = 0; i < nb_nalus; i++) {
		length = stream.readUint16();
		this.PPS[i] = stream.readUint8Array(length);
		toparse -= 2+length;
	}
}

// file:src/parsing/dref.js
BoxParser.drefBox.prototype.parse = function(stream) {
	var ret;
	var box;
	this.parseFullHeader(stream);
	this.entries = [];
	var entry_count = stream.readUint32();
	for (var i = 0; i < entry_count; i++) {
		ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
		box = ret.box;
		this.entries.push(box);
	}
}

// file:src/parsing/elst.js
BoxParser.elstBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	this.entries = [];
	var entry_count = stream.readUint32();
	for (var i = 0; i < entry_count; i++) {
		var entry = {};
		this.entries.push(entry);
		entry.segment_duration = stream.readUint32();
		entry.media_time = stream.readInt32();
		entry.media_rate_integer = stream.readInt16();
		entry.media_rate_fraction = stream.readInt16();
	}
}

// file:src/parsing/ftyp.js
BoxParser.ftypBox.prototype.parse = function(stream) {
	var toparse = this.size - this.hdr_size;
	this.major_brand = stream.readString(4);
	this.minor_version = stream.readUint32();
	toparse -= 8;
	this.compatible_brands = [];
	var i = 0;
	while (toparse>=4) {
		this.compatible_brands[i] = stream.readString(4);
		toparse -= 4;
		i++;
	}
}

// file:src/parsing/hdlr.js
BoxParser.hdlrBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream)
	stream.readUint32();
	this.handler = stream.readString(4);
	stream.readUint32Array(3);
	this.name = stream.readString(this.size-this.hdr_size-20);
	if (this.name[this.name.length-1]==='\0') {
		this.name = this.name.slice(0,-1);
	}
}

// file:src/parsing/mdhd.js
BoxParser.mdhdBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream)
	this.creation_time = stream.readUint32();
	this.modification_time = stream.readUint32();
	this.timescale = stream.readUint32();
	this.duration = stream.readUint32();
	this.parseLanguage(stream);
	stream.readUint16();
}

// file:src/parsing/mehd.js
BoxParser.mehdBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream)
	this.version = 1;
	this.fragment_duration = stream.readUint64();
}

// file:src/parsing/mvhd.js
BoxParser.mvhdBox.prototype.parse = function(stream) {
	this.flags = 0
	this.parseFullHeader(stream)
	this.creation_time = stream.readUint32();
	this.modification_time = stream.readUint32();
	this.timescale = stream.readUint32();
	this.duration = stream.readUint32();
	this.rate = stream.readUint32();
	this.volume = stream.readUint16()>>8;
	stream.readUint16();
	stream.readUint32Array(2);
	this.matrix = stream.readUint32Array(9);
	stream.readUint32Array(6);
	this.next_track_id = stream.readUint32();
}

BoxParser.esdsBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	stream.readUint8Array(this.size-this.hdr_size);
}

// file:src/parsing/sampleentries/sampleentry.js
BoxParser.SampleEntry.prototype.parseHeader = function(stream) {
	stream.readUint8Array(6);
	this.data_reference_index = stream.readUint16();
	this.hdr_size += 8;
}

BoxParser.SampleEntry.prototype.parse = function(stream) {
	this.parseHeader(stream);
	stream.readUint8Array(this.size - this.hdr_size);
	// this.data = stream.readUint8Array(this.size - this.hdr_size);
}

BoxParser.SampleEntry.prototype.parseDataAndRewind = function(stream) {
	this.parseHeader(stream);
	stream.readUint8Array(this.size - this.hdr_size);
	// this.data = stream.readUint8Array(this.size - this.hdr_size);
	this.hdr_size -= 8;
	stream.position -= this.size-this.hdr_size;
}

BoxParser.SampleEntry.prototype.parseFooter = function(stream) {
	var ret;
	var box;
	while (stream.getPosition() < this.start+this.size) {
		ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
		if (ret.code === BoxParser.OK) {
			box = ret.box;
			this.boxes.push(box);
			this[box.type] = box;
		}
	}	
}

BoxParser.VisualSampleEntry.prototype.parse = function(stream) {
	// debugger
	this.parseHeader(stream);
	// console.log('position: ', stream.position)
	stream.readUint16(); 
	stream.readUint16();
	stream.readUint32Array(3);
	this.width = stream.readUint16();
	this.height = stream.readUint16();
	this.horizresolution = stream.readUint32();
	this.vertresolution = stream.readUint32();
	stream.readUint32();
	this.frame_count = stream.readUint16();
	this.compressorname = stream.readString(32);
	this.depth = stream.readUint16();
	stream.readUint16();
	this.parseFooter(stream);
}

BoxParser.AudioSampleEntry.prototype.parse = function(stream) {
	this.parseHeader(stream);
	stream.readUint32Array(2);
	this.channel_count = stream.readUint16();
	this.samplesize = stream.readUint16();
	stream.readUint16();
	stream.readUint16();
	this.samplerate = (stream.readUint32()/(1<<16));
	debugger
	this.parseFooter(stream);
}

// file:src/parsing/sidx.js
BoxParser.sidxBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	this.reference_ID = stream.readUint32();
	this.timescale = stream.readUint32();

	this.earliest_presentation_time = stream.readUint32();
	this.first_offset = stream.readUint32();

	stream.readUint16();
	this.references = [];
	var count = stream.readUint16();
	for (var i = 0; i < count; i++) {
		var ref = {};
		this.references.push(ref);
		var tmp_32 = stream.readUint32();
		ref.reference_type = (tmp_32 >> 31) & 0x1;
		ref.referenced_size = tmp_32 & 0x7FFFFFFF;
		ref.subsegment_duration = stream.readUint32();
		tmp_32 = stream.readUint32();
		ref.starts_with_SAP = (tmp_32 >> 31) & 0x1;
		ref.SAP_type = (tmp_32 >> 28) & 0x7;
		ref.SAP_delta_time = tmp_32 & 0xFFFFFFF;
	}
}

// file:src/parsing/stco.js
BoxParser.stcoBox.prototype.parse = function(stream) {
	var entry_count;
	this.parseFullHeader(stream);
	entry_count = stream.readUint32();
	this.chunk_offsets = stream.readUint32Array(entry_count)
}

// file:src/parsing/stsc.js
BoxParser.stscBox.prototype.parse = function(stream) {
	var entry_count;
	var i;
	this.parseFullHeader(stream);
	entry_count = stream.readUint32();
	this.first_chunk = [];
	this.samples_per_chunk = [];
	this.sample_description_index = []
	for(i = 0; i < entry_count; i++) {
		this.first_chunk.push(stream.readUint32());
		this.samples_per_chunk.push(stream.readUint32());
		this.sample_description_index.push(stream.readUint32());
	}
}

// file:src/parsing/stsd.js
BoxParser.stsdBox = function(size) {
	BoxParser.FullBox.call(this, "stsd", size);
	this.entries = [];
};
BoxParser.stsdBox.prototype = new BoxParser.FullBox();
BoxParser.stsdBox.prototype.parse = function(stream) {
	var i;
	var ret;
	var entryCount;
	var box;
	this.parseFullHeader(stream);
	entryCount = stream.readUint32();
	for (i = 1; i <= entryCount; i++) {
		ret = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
		if (BoxParser[ret.type+"SampleEntry"]) {
			var aaa = new BoxParser[ret.type+"SampleEntry"]

			box = new BoxParser[ret.type+"SampleEntry"](ret.size);
			box.hdr_size = ret.hdr_size;
			box.start = ret.start;
		}
		box.parseDataAndRewind(stream)
		if (box.type === 'mp4a') {
			debugger
		}
		box.parse(stream);
		this.entries.push(box);
	}
}

// file:src/parsing/stsz.js
BoxParser.stszBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	this.sample_sizes = [];
	this.sample_size = stream.readUint32();
	this.sample_count = stream.readUint32();
	this.sample_sizes = stream.readUint32Array(this.sample_count);
}

// file:src/parsing/stts.js
BoxParser.sttsBox.prototype.parse = function(stream) {
	var entry_count;
	var i;
	var delta;
	this.parseFullHeader(stream);
	entry_count = stream.readUint32();
	this.sample_counts = [];
	this.sample_deltas = [];
	if (this.version === 0) {
		debugger
		for(i = 0; i < entry_count; i++) {
			this.sample_counts.push(stream.readUint32());
			delta = stream.readInt32();
			if (delta < 0) delta = 1;
			this.sample_deltas.push(delta);
		}
	}
}

// file:src/parsing/tkhd.js
BoxParser.tkhdBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	
	this.creation_time = stream.readUint32();
	this.modification_time = stream.readUint32();
	this.track_id = stream.readUint32();
	stream.readUint32();
	this.duration = stream.readUint32();
	
	stream.readUint32Array(2);
	this.layer = stream.readInt16();
	this.alternate_group = stream.readInt16();
	this.volume = stream.readInt16()>>8;
	stream.readUint16();
	this.matrix = stream.readInt32Array(9);
	this.width = stream.readUint32();
	this.height = stream.readUint32();
}

// file:src/parsing/trex.js
BoxParser.trexBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	this.track_id = stream.readUint32();
	this.default_sample_description_index = stream.readUint32();
	this.default_sample_duration = stream.readUint32();
	this.default_sample_size = stream.readUint32();
	this.default_sample_flags = stream.readUint32();
}

// file:src/parsing/url.js
BoxParser["url Box"].prototype.parse = function(stream) {
	this.parseFullHeader(stream)
}

// file:src/parsing/vmhd.js
BoxParser.vmhdBox.prototype.parse = function(stream) {
	this.parseFullHeader(stream);
	this.graphicsmode = stream.readUint16();
	this.opcolor = stream.readUint16Array(3);
}

// file:src/isofile.js
var ISOFile = function (stream) {
	this.stream = stream
	this.boxes = []
	this.isProgressive = false
	this.moovStartFound = false;
}

ISOFile.prototype.parse = function() {
	var found;
	var ret;
	var box;

	this.restoreParsePosition()
	
	while (true) {
		if (this.saveParsePosition)	this.saveParsePosition()
		ret = BoxParser.parseOneBox(this.stream, false)
		if (ret.code === BoxParser.ERR_NOT_ENOUGH_DATA) return
		else {
			box = ret.box;
			this.boxes.push(box);
			switch (box.type) {
				case "moov":
					this.moovStartFound = true;
					this.isProgressive  = true;
				default:
					this[box.type] = box;
					break;
			}
			if (this.updateUsedBytes) {
				this.updateUsedBytes(box, ret)
			}
		}
	}
}

if (typeof exports !== 'undefined') {
	exports.ISOFile = ISOFile;	
}

// file:src/isofile-advanced-parsing.js
ISOFile.prototype.lastBoxStartPosition = 0;

ISOFile.prototype.restoreParsePosition = function() {
	return this.stream.seek(this.lastBoxStartPosition, true)
}

ISOFile.prototype.saveParsePosition = function() {
	this.lastBoxStartPosition = this.stream.getPosition()
}

ISOFile.prototype.updateUsedBytes = function(box, ret) {
	this.stream.addUsedBytes(box.size)
}
ISOFile.prototype.add = BoxParser.Box.prototype.add
ISOFile.prototype.lastMoofIndex = 0;
ISOFile.prototype.samplesDataSize = 0;
ISOFile.prototype.items = [];
ISOFile.prototype.itemsDataSize = 0;

// file:src/mp4box.js
var MP4Box = function () {
	this.inputStream = new MultiBufferStream()
	this.inputIsoFile = new ISOFile(this.inputStream)
}

MP4Box.prototype.checkBuffer = function (ab) {
	ab.usedBytes = 0;
	this.inputStream.insertBuffer(ab)
	return true
}

MP4Box.prototype.appendBuffer = function(ab) {
	if (this.checkBuffer && !this.checkBuffer(ab)) return
	this.inputIsoFile.parse()
	this.inputStream.cleanBuffers()
}

if (typeof exports !== 'undefined') {
	exports.MP4Box = MP4Box;	
}
