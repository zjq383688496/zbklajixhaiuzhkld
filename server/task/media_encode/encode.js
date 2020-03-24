let { task, sequelize } = global
let { media_encode } = task
let { __encode } = require('../../config')
const { getMediaInfo, trackSeparate } = require('../../utils/video')
const { getInfo, getDump, toFmp4Video, toFmp4Audio } = require('../../utils/media')
const mkdir = require('../../utils/mkdir')
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

async function encode(data, hash) {
    media_encode.encodeState = true
    let { type } = data
    let fn = encodeFn[`encode_${type}`]
    if (fn) await fn(data, hash)
    media_encode.encodeState = false
}

module.exports = encode

let encodeFn = {
    encode_video: async function(data, hash) {
        return new Promise(async resolve => {
            let { width, height, fps, dir, parentId, quality, source, name } = data,
                where = { parentId, quality }
            let result = await Video.findOne({ where })
            if (!result || result.url) {
                await redis.lpop('encode_queue')
                await redis.del(hash)
            }
            if (result.url) return resolve(result.url)
            let { id } = result
            await mkdir(dir)
            let url  = await toFmp4Video(source, dir, name, width, height, fps),
            info = await getInfo(url),
            dump = await getDump(url),
            { codecs_string, duration, media, size } = info,
            idx   = 0,
            range = 0
            while(true) {
                let tag = dump[idx],
                { size: _size } = tag
                range += _size
                if (tag.name === 'sidx') break
                ++idx
            }
            Video.update({
                bitrate: media.bitrate,
                duration,
                initRange: range,
                mimeType: `video\/mp4\; codecs=\"${codecs_string}\"`,
                size,
                url: data.url,
            }, { where: { id } })

            await redis.lpop('encode_queue')
            await redis.del(hash)
            resolve(url)
        })
    },
    encode_audio: async function(data, hash) {
        return new Promise(async resolve => {
            let { bit, dir, parentId, quality, source, trackId, name } = data,
                where = { parentId, quality, trackId }
            let result = await Audio.findOne({ where })
            if (!result || result.url) {
                await redis.lpop('encode_queue')
                await redis.del(hash)
            }
            if (result.url) return resolve(result.url)
            let { id } = result
            await mkdir(dir)
            let url  = await toFmp4Audio(source, dir, name, bit),
                info = await getInfo(url),
                dump = await getDump(url),
                { codecs_string, duration, media, size } = info,
                idx   = 0,
                range = 0
            while(true) {
                let tag = dump[idx],
                    { size: _size } = tag
                range += _size
                if (tag.name === 'sidx') break
                ++idx
            }
            Audio.update({
                bitrate: media.bitrate,
                duration,
                initRange: range,
                mimeType: `audio\/mp4\; codecs=\"${codecs_string}\"`,
                size,
                url: data.url,
            }, { where: { id } })

            await redis.lpop('encode_queue')
            await redis.del(hash)
            resolve(url)
        })
    }
}
