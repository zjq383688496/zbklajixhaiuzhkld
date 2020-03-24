import { xhr, getMedia } from './utils/xhr'
import Mp4parse from '@/utils/mp4info'

const baseUrl = 'http://localhost:4090'

const fragmentLimit = 6

const videoQualityMap = {
	1: '240p',
	2: '360p',
	3: '480p',
	4: '720p',
	5: '1080p',
	6: '4k'
}
const audioQualityMap = {
	1: '32k',
	2: '64k',
	3: '128k',
	4: '160k',
}

class IMS {
	constructor(video, id, options = {}) {
		this.$video = video
		this.id     = id
		this.init()
		Object.assign(this, { ...options })
	}

	// 初始变量options
	$ended       = false
	_currentTime = 0
	_duration    = 0
	base_url     = ''
	currentTime  = 0
	mime_video   = 'video/mp4; codecs="avc1.64001f"'
	mime_audio   = 'audio/mp4; codecs="mp4a.40.2"'
	info_video   = { updateTime: 0, updateSpaceTime: 20, lock: false, endTime: 0, updateLock: false, }
	info_audio   = { updateTime: 0, updateSpaceTime: 20, lock: false, endTime: 0, updateLock: false, }
	mediaHeader  = {}
	videoIndex   = {}
	audioIndex   = {}
	videoStreams = []
	audioStreams = []
	videoBuffer  = null
	audioBuffer  = null
	track_video  = '480p'
	track_audio  = '96k'

	canplayLock  = false

	async init() {
		let { id } = this
		await this.getInfo(id)
		this.initTrack()
	}

	initTrack(vIndex = 0, aIndex = 0) {
		let video = this.videoStreams[vIndex],
			audio = this.audioStreams[aIndex],
			{ base_url } = this

		this.track_video = videoQualityMap[video.quality]
		this.track_audio = audioQualityMap[audio.quality]
		this.mime_video  = video.mimeType
		this.mime_audio  = audio.mimeType
		this.videoInfo   = video
		this.audioInfo   = audio

		this._duration = Math.min(video.duration, audio.duration)

		Object.assign(this.mediaHeader, {
			video: `${baseUrl}/admin${base_url}${video.url}`,
			audio: `${baseUrl}/admin${base_url}${audio.url}`,
		})

		this.initMS()
	}

	// 初始化播放器
	initMS() {
		this.$video.src = null
		let mediaSource = this.mediaSource = new MediaSource()
		mediaSource.addEventListener('sourceopen', this.sourceOpen.bind(this))
		this.$video.addEventListener('error', this.error)
		this.$video.src = URL.createObjectURL(mediaSource)
	}

	error(e) {
		console.error(e)
	}

	// 获取媒体信息
	async getInfo(id, type) {
		return new Promise(async res => {
			let { code, data } = await xhr(`${baseUrl}/admin/videos/${id}`),
				{ title, baseUrl: base_url, streams = [] } = data,
				vIndex = 0, aIndex = 0
			this.base_url = base_url
			streams.forEach(stream => {
				let index
				let { width, height, trackId, quality } = stream
				if (width) {
					stream.index = vIndex
					index = videoQualityMap[quality]
					this.videoIndex[index] = stream
					this.videoStreams.push(stream)
					++vIndex
				} else {
					stream.index = aIndex
					index = audioQualityMap[quality]
					this.audioIndex[index] = stream
					this.audioStreams.push(stream)
					++aIndex
				}
			})
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
		let { $video, _currentTime, _duration, mediaSource, mediaHeader, videoInfo, audioInfo } = this
		let videoBuffer = this.createSourceBuffer('video')
		let audioBuffer = this.createSourceBuffer('audio')
		await this.initMediaStream(videoBuffer, mediaHeader)
		await this.initMediaStream(audioBuffer, mediaHeader)
		$video.addEventListener('timeupdate', throttle(this.timeUpdata.bind(this)))
		// $video.addEventListener('ended', this.handleEnded)
		this.$video.currentTime = _currentTime
		this.$video.play()
	}

	// 媒体流初始化
	initMediaStream(sourceBuffer, header) {
		let { $video } = this,
			{ mediaType } = sourceBuffer,
			{ initRange, url } = this[`${mediaType}Info`],
			api = header[mediaType],
			{ start, end } = initRange
		return new Promise(async (resolve, reject) => {
			getMedia(`${api}?s=${start}&e=${end}`).then(async buffer => {
				let me = this
				function addEnd() {
					sourceBuffer.removeEventListener('updateend', addEnd)
					console.log('currentTime: ', $video.currentTime)
					me.loadMediaBuffer(sourceBuffer, $video.currentTime || 0)
				}
				sourceBuffer.addEventListener('updateend', addEnd)
				this[`${mediaType}Mp4`] = new Mp4parse(buffer)
				// let playlist = mp4.getFragments(0, 8)
				// console.log(playlist)
				sourceBuffer.appendBuffer(buffer)
				resolve()
			})
		})
	}

	// 加载视频内容
	async loadMediaBuffer(sourceBuffer, duration = 0) {
		return new Promise(async (resolve, reject) => {
			let { mediaType } = sourceBuffer,
				Mp4     = this[`${mediaType}Mp4`],
				info    = this[`info_${mediaType}`],
				quality = this[`track_${mediaType}`],
				api     = this.mediaHeader[mediaType]
			if (info.lock) return console.log('lock')
			info.lock = true

			let queues = Mp4.getFragments(0, fragmentLimit),
				fragments = []

			// 更新队列
			queues.forEach(({ range: { start, end } }, i) => {
				fragments.push(`${api}?s=${start}&e=${end}`)
			})

			if (fragments.length) await this.MSELoadTrack(fragments, sourceBuffer, mediaType, queues)
			info.lock = false
			resolve()
		})
	}

	// 时间更新
	timeUpdata() {
		let { $video, $ended, _duration, info_video, info_audio } = this,
			{ currentTime } = $video
		if ($ended) return
		if (currentTime >= _duration) return this.handleEnded()
		this.timeUpdataMedia(info_video, this.videoBuffer, currentTime)
		this.timeUpdataMedia(info_audio, this.audioBuffer, currentTime)
	}

	async timeUpdataMedia({ updateTime, endTime, updateLock }, sourceBuffer, currentTime) {
		if (currentTime < updateTime) return// console.log('currentTime: ', currentTime, updateTime)
		if (updateLock) return console.log('updateLock: ', updateLock)
		this.loadMediaBuffer(sourceBuffer, endTime)
	}

	// 播放结束
	handleEnded() {
		let { $video, $ended } = this
		if ($ended) return
		this.$ended = true
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
						let { updateSpaceTime }    = info,
							{ range, time, isEnd } = queues[queues.length - 1],
							{ end: lastEndTime }   = time
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

	set trackVideo(value) {
		let { currentTime, track_video, videoIndex } = this, stream
		if (track_video === value) return
		stream = videoIndex[value]
		if (!stream) return
		let vIndex = stream.index
		this.initTrack(vIndex)
		this._currentTime = currentTime
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