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
export default DataBuffer