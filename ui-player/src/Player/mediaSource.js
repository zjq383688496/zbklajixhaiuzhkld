import { xhr } from './utils/xhr'
import Mp4parse from '@/utils/mp4info'

const baseUrl = 'http://localhost:4090'

const fragmentLimit = 6
const mime_video = 'video/mp4; codecs="avc1.64001f"'
const mime_audio = 'audio/mp4; codecs="mp4a.40.2"'

class IMS {
	constructor(video, id, options = {}) {
		this.$video = video
		this.id     = id
		this.init()
		Object.assign(this, { ...options })
	}

	// 初始变量options
	currentTime = 0
	mime_video  = 'video/mp4; codecs="avc1.64001f"'
	mime_audio  = 'audio/mp4; codecs="mp4a.40.2"'
	info_video  = { updateTime: 0, updateSpaceTime: 20, lock: false, endTime: 0, updateLock: false, }
	info_audio  = { updateTime: 0, updateSpaceTime: 20, lock: false, endTime: 0, updateLock: false, }
	mediaHeader = {}
	videoBuffer = null
	audioBuffer = null
	track_video = '480p'
	track_audio = '96k'

	timeout = null

	canplayLock = false

	init() {
		let { id } = this
		Promise.all([this.getInfo(id, 'video'), this.getInfo(id, 'audio')]).then(res => {
			this.initMS()
		})
		
	}

	// 初始化播放器
	initMS() {
		let mediaSource = this.mediaSource = new MediaSource()
		this.$video.src = URL.createObjectURL(mediaSource)
		mediaSource.addEventListener('sourceopen', this.sourceOpen.bind(this))
		this.$video.addEventListener('error', this.error)
	}

	error(e) {
		console.error(e)
	}

	// 获取媒体信息
	async getInfo(id, type) {
		return new Promise(async res => {
			let info = await this.getMediaInfo(type, this[`track_${type}`]),
				{ url } = info,
				obj  = {},
				head = {}

			obj[`${type}Info`] = info
			head[type] = url

			Object.assign(this, obj)
			Object.assign(this.mediaHeader, head)
			res()
		})
	}

	// 获取视频信息
	getMediaInfo(mediaType, quality) {
		return new Promise(async res => {
			var info = await xhr(`${baseUrl}/static/${mediaType}info?q=${quality}`)
			res(info.data)
		})
	}
	
	// 创建SourceBuffer
	createSourceBuffer(type) {
		let info = this[`${type}Info`]
		let sourceBuffer = this[`${type}Buffer`] = this.mediaSource.addSourceBuffer(this[`mime_${type}`])
		sourceBuffer.mediaType = type
		sourceBuffer.duration  = info.duration
		return sourceBuffer
	}

	// 媒体源准备完毕
	async sourceOpen() {
		let { $video, mediaSource, mediaHeader, videoInfo, audioInfo } = this
		let videoBuffer = this.createSourceBuffer('video')
		let audioBuffer = this.createSourceBuffer('audio')
		// videoBuffer.mode ='sequence'
		await this.initMediaStream(videoBuffer, mediaHeader)
		await this.initMediaStream(audioBuffer, mediaHeader)
		$video.addEventListener('timeupdate', throttle(this.timeUpdata.bind(this)))
	}

	// 媒体流初始化
	initMediaStream(sourceBuffer, header) {
		let { $video } = this,
			{ mediaType } = sourceBuffer,
			url = header[mediaType]
		return new Promise(async (resolve, reject) => {
			xhr(url, { format: 'arraybuffer' }).then(async buffer => {
				let me = this
				function addEnd() {
					sourceBuffer.removeEventListener('updateend', addEnd)
					console.log('currentTime: ', $video.currentTime)
					me.loadMediaBuffer(sourceBuffer, $video.currentTime || 0)
				}
				sourceBuffer.addEventListener('updateend', addEnd)
				let mp4  = new Mp4parse(buffer)
				console.log(mp4)
				sourceBuffer.appendBuffer(buffer)
				resolve()
			})
		})
	}

	// 加载视频内容
	async loadMediaBuffer(sourceBuffer, duration = 0) {
		return new Promise(async (resolve, reject) => {
			let { mediaType } = sourceBuffer,
				info = this[`info_${mediaType}`],
				quality = this[`track_${mediaType}`]
			if (info.lock) return console.log('lock')
			info.lock = true
			let { data: queues } = await xhr(`${baseUrl}/static/${mediaType}play?d=${duration}&m=${fragmentLimit}&q=${quality}`),
				fragments = [],
				{ index } = info

			// 更新队列
			queues.forEach(([ start, end ], i) => {
				fragments.push(`${baseUrl}/static/${mediaType}playback?s=${start}&e=${end}&q=${quality}`)
			})

			if (fragments.length) await this.MSELoadTrack(fragments, sourceBuffer, mediaType, queues)
			info.lock = false
			resolve()
		})
	}

	// 时间更新
	timeUpdata() {
		let { $video, info_video, info_audio } = this,
			{ currentTime, duration } = $video
		console.log('update')
		this.timeUpdataMedia(info_video, this.videoBuffer, currentTime)
		this.timeUpdataMedia(info_audio, this.audioBuffer, currentTime)
		if ((duration - currentTime) < 1) return this.handleEnded()
	}

	async timeUpdataMedia({ updateTime, endTime, updateLock }, sourceBuffer, currentTime) {
		if (currentTime < updateTime) return// console.log('currentTime: ', currentTime, updateTime)
		if (updateLock) return console.log('updateLock: ', updateLock)
		console.log('update')
		this.loadMediaBuffer(sourceBuffer, endTime)
	}

	// 播放结束
	handleEnded() {
		console.log('handleEnded')
	}

	// 加载轨道
	MSELoadTrack(fragments, sourceBuffer, type, queues) {
		return new Promise((resolve, reject) => {
			let me = this,
				{ mediaSource, MSEClearTrackBuffer } = this,
				info = this[`info_${type}`]

			Promise.all(fragments.map(fragment => xhr(fragment, { format: 'arraybuffer' }))).then(bufferArray => {
				async function addNextFragment() {
					let buf = bufferArray.shift()
					if (!buf) {
						sourceBuffer.removeEventListener('updateend', addNextFragment)

						// 重置 下次更新时间
						let { updateSpaceTime } = info,
							lastQueue   = queues[queues.length - 1],
							lastEndTime = lastQueue[3],
							isEnd       = lastQueue[4]
						info.updateTime = lastEndTime
						if (isEnd) {
							info.updateLock = true
						} else {
							info.updateTime = info.updateTime - updateSpaceTime
						}
						info.endTime = lastEndTime
						// console.log('fragments: ', fragments)
						return MSEClearTrackBuffer.bind(me, sourceBuffer, resolve)()
					}
					sourceBuffer.appendBuffer(buf)
				}
				sourceBuffer.addEventListener('updateend', addNextFragment)
				addNextFragment()
			})
		})
	}

	// 清除轨道buffer
	MSEClearTrackBuffer(sourceBuffer, resolve) {
		let { $video, handleClearBuffer } = this,
			{ currentTime } = $video,
			endTime = (currentTime - 20) | 0

		if (endTime < 1) return resolve()
		console.log('delete: ', `0-${endTime}`)
		handleClearBuffer(sourceBuffer, 0, endTime, resolve)
	}

	// 清除buffer
	handleClearBuffer(sourceBuffer, startTime = 0, endTime, resolve) {
		let { duration } = sourceBuffer
		endTime = endTime || duration
		function clearEnd() {
			sourceBuffer.removeEventListener('updateend', clearEnd)
			resolve && resolve()
		}
		sourceBuffer.addEventListener('updateend', clearEnd)
		sourceBuffer.remove(startTime, endTime)
	}

	set currentTime(value) {
		if (!this.$video) return
		(async () => {
			let { videoInfo, audioInfo, videoBuffer, audioBuffer } = this
			if (!videoInfo.lock) {
				videoInfo.index = {}
				this.loadMediaBuffer(videoBuffer, value - 1)
			}
			if (!audioInfo.lock) {
				audioInfo.index = {}
				this.loadMediaBuffer(audioBuffer, value - 1)
			}
			this.$video.currentTime = value
		})()
	}

	get currentTime() {
		return this.$video.currentTime
	}

	get duration() {
		return this.$video.duration
	}

	set trackAudio(value) {
		if (this.track_audio === value) return
		this.track_audio = value
	}

	set trackVideo(value) {
		if (this.track_video === value) return
		this.track_video = value
		let me = this
		let { mediaHeader, videoBuffer } = me
		if (this.mediaSource) {
			this.mediaSource.removeSourceBuffer(videoBuffer)
			setTimeout(() => {
				let _videoBuffer = this.createSourceBuffer('video')
				debugger
			}, 1000)
		}
		// this.getInfo('id', 'video').then(res => {
		// 	me.initMediaStream(videoBuffer, mediaHeader)
		// })
	}
}

export function createMS() {
	return new IMS(...arguments)
}

function throttle(func, delay = 1000) {
	let timer = null
	let startTime = Date.now()
	return function() {
		let curTime = Date.now()
		let remaining = delay - (curTime - startTime)
		let context = this
		let args = arguments
		clearTimeout(timer)
		if (remaining <= 0) {
			func.apply(context, args)
			startTime = Date.now()
		} else {
			timer = setTimeout(func, remaining)
		}
	}
}