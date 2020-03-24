const fs = require('fs')
const { __tmp, __encode, sbin } = require('../config')
const { exec, spawn } = require('./child_process')
const mkdir = require('./mkdir')

let { task } = global

const profileMap = {
    240:  'main',
    360:  'main',
    480:  'main',
    720:  'high',
    1080: 'high',
    2160: 'high',
}
const presetMap = {
    240:  'veryslow',
    360:  'slower',
    480:  'slower',
    720:  'slow',
    1080: 'medium',
    2160: 'medium',
}
const levelMap = {
    240:  '3',
    360:  '3',
    480:  '3',
    720:  '3.1',
    1080: '3.2',
    2160: '4',
}

module.exports = {
    getInfo,
    getDump,
    toFmp4Video,
    toFmp4Audio
}

// 获取信息
function getInfo(path) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(path)) return resolve()
        let stat = fs.statSync(path)
		let stdout = await spawn(sbin.mp4info, `--format json ${path}`)
		var str = infoFormat(JSON.parse(stdout), stat)
		resolve(str)
	})
}

// 数据格式化
function infoFormat(data, stat) {
	let { file, movie, tracks: [ track ] } = data,
        newData = Object.assign({}, file, movie, track),
        { duration, time_scale, sample_descriptions: [ sample_description ] } = newData
    newData.duration = duration / time_scale
    Object.assign(newData, sample_description, { size: stat.size })
    return newData
}

function toFmp4Video(source, dir, name, width, height, fps) {
    return new Promise(async (resolve, reject) => {
        let bit = width * height * fps / 15000 >> 0
        let tmp     = `${dir}/_${name}`,
            output  = `${dir}/${name}`,
            profile = profileMap[height],
            preset  = presetMap[height],
            level   = levelMap[height],
            ffcfg   = `-y -i ${source} -s ${width}x${height} -an -c:v libx264 -profile:v ${profile} -level ${level} -preset ${preset} -b:v ${bit}k -f mp4 ${tmp}`
        console.log(ffcfg)
        await spawn(sbin.ffmpeg, ffcfg)
        await spawn(sbin.mp4fragment, `--track video --index --fragment-duration 20000 ${tmp} ${output}`)
        await fs.unlinkSync(tmp)
        resolve(output)
    })
}

function toFmp4Audio(source, dir, name, bit) {
    return new Promise(async (resolve, reject) => {
        let tmp    = `${dir}/_${name}`,
            output = `${dir}/${name}`
        await spawn(sbin.ffmpeg, `-y -i ${source} -vn -c:a aac -b:a ${bit}k ${tmp}`)
        await spawn(sbin.mp4fragment, `--track audio --index --fragment-duration 20000 ${tmp} ${output}`)
        await fs.unlinkSync(tmp)
        resolve(output)
    })
}

function getDump(path) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(path)) return resolve()
		let stdout = await spawn(sbin.mp4dump, `--format json ${path}`)
		resolve(JSON.parse(stdout))
	})
}