let fs = require('fs')
let { task, sequelize } = global
let { media_parse } = task
let { __encode } = require('../../config')
const { getMediaInfo, trackSeparate } = require('../../utils/video')
const { getInfo } = require('../../utils/media')
const { Media, Video, Audio } = sequelize

const extMap  = { 1: 'p', 2: 'k' }
const typeMap = { 1: 'video', 2: 'audio' }
const qualityMap = {
    240:  1,
    360:  2,
    480:  3,
    720:  4,
    1080: 5,
    2160: 6,
    32:   1,
    64:   2,
    128:  3,
    160:  4,
}

let resolutionRatio = [ 240, 360, 480, 720, 1080, 2160 ],
    audioBit = [ 32, 64, 128, 160 ]

async function parse({ parentId, path }, code) {
    media_parse.state = true
    let result = await Media.findOne({ where: { id: parentId } })
    let info   = await getMediaInfo(path)
    let tracks = await trackSeparate(info, path, code)
    let queue  = await queueParse(info, tracks)
    await updataTracks(info, tracks, parentId, queue, code)
    await redis.lpop('task_queue')
    await redis.del(code)
    await fs.unlinkSync(path)
    media_parse.state = false
}

module.exports = parse

// 队列解析
function queueParse(info, tracks) {
    let { video, audio } = info,
        { video: _video, audio: _audio } = tracks

    let videoQuality = videoParse(video, _video)
    let audioQuality = audio.map((a, i) => audioParse(a, _audio[i]))
    return { video: videoQuality, audio: audioQuality }
}
// 视频解析
function videoParse(info, path) {
    let { size_aspect_ratio, height, frame_rate } = info,
        quality = []

    resolutionRatio.forEach(ratio => {
        if (ratio < (height + 32)) {
            let width = ratio * size_aspect_ratio >> 0,
                diff  = width % 4
            if (diff) diff = 4 - diff
            quality.push({
                width:  width + diff,
                height: ratio,
                fps: frame_rate,
            })
        }
    })
    return quality
}
// 音频解析
function audioParse(info, path) {
    let { bit_rate } = info,
        bit  = bit_rate / 1e3,
        diff = bit % 16
        quality = []

    if (diff) diff = 16 - diff
    bit += diff

    audioBit.forEach(_bit => {
        if (_bit <= bit) quality.push(_bit)
    })
    return quality
}
// 更新轨道
function updataTracks(info, tracks, parentId, queue, parentCode) {
    return new Promise(async resolve => {
        let { video, audio } = info,
            { video: _video, audio: _audio } = tracks,
            { video: $video, audio: $audio } = queue
        Promise.all(audio.map((a, i) => updataAudio(_audio[i], parentId, parentCode, i, 0, $audio[i]))).then(async res => {
            let videoTask = await updataVideo(_video, parentId, parentCode, 0, $video)
            resolve()
        })
    })
}
// 更新视频
function updataVideo(path, parentId, parentCode, quality, queue) {
    return new Promise(async resolve => {
        let result = await Video.findOne({ where: { parentId, quality } })
        if (result) return resolve()
        let info = await getInfo(path),
            { codecs_string, duration, frame_rate, size, media, width, height } = info,
            idx = 0

        while(true) {
            let q = queue[idx]
            if (!q) break
            await addVideoQueue(path, parentId, parentCode, q)
            ++idx
        }
        // 写入数据库
        await Video.create({
            parentId,
            parentCode,
            mimeType: codecs_string,
            fps: frame_rate,
            duration,
            size,
            width,
            height,
            bitrate: media.bitrate
        })
        resolve()
    })
}
// 更新音频
function updataAudio(path, parentId, parentCode, trackId, quality, queue) {
    return new Promise(async resolve => {
        let result = await Audio.findOne({ where: { parentId, trackId, quality } })
        if (result) return resolve()
        let info = await getInfo(path),
            { codecs_string, duration, size, media } = info,
            idx = 0
            
        while(true) {
            let q = queue[idx]
            if (!q) break
            await addAudioQueue(path, parentId, parentCode, q, trackId)
            ++idx
        }

        // 写入数据库
        await Audio.create({
            parentId,
            parentCode,
            trackId,
            mimeType: codecs_string,
            duration,
            size,
            bitrate: media.bitrate
        })
        resolve()
    })
}
// 新增编码队列
function addVideoQueue(source, parentId, parentCode, { width, height, fps }) {
    return new Promise(async resolve => {
        let quality = qualityMap[height]
        let result  = await Video.findOne({ where: { parentId, quality } })
        if (result) return resolve(result)
        let subDir = `${height}p`,
            key    = `${parentCode}_${subDir}`,
            dir    = `${__encode}/${parentCode}/${subDir}`,
            name   = `v.mp4`,
            data   = {
                parentId,
                source,
                type: 'video',
                name,
                dir,
                url: `/${subDir}/${name}`,
                code: parentCode,
                quality,
                width,
                height,
                fps,
            }

        // 写入数据库
        await Video.create({
            parentId,
            parentCode,
            width,
            height,
            quality,
            fps,
        })
        await redis.rpush('encode_queue', key)
        await redis.set(key, JSON.stringify(data))
        resolve(data)
    })
}
function addAudioQueue(source, parentId, parentCode, bit, trackId) {
    return new Promise(async resolve => {
        let quality = qualityMap[bit]
        let result  = await Audio.findOne({ where: { parentId, quality, trackId } })
        if (result) return resolve(result)
        let subDir = `${bit}k`,
            key    = `${parentCode}_${subDir}`,
            dir    = `${__encode}/${parentCode}/${subDir}`,
            name   = `a_${trackId}.m4a`,
            data   = {
                parentId,
                source,
                type: 'audio',
                dir,
                url: `/${subDir}/${name}`,
                code: parentCode,
                name,
                quality,
                trackId,
                bit,
            }

        // 写入数据库
        await Audio.create({
            parentId,
            parentCode,
            quality,
            trackId
        })
        await redis.rpush('encode_queue', key)
        await redis.set(key, JSON.stringify(data))
        resolve(data)
    })
}