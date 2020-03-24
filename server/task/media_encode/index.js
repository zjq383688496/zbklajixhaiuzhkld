const schedule  = require('node-schedule')
const { redis, task } = global
const encode = require('./encode')

let { media_encode } = task
media_encode.encodeState = false
let mediaEncode = schedule.scheduleJob('*/10 * * * * *', async () => {
    if (media_encode.encodeState) return// console.log('当前有正在编码的任务!')
    let hash = await redis.lindex('encode_queue', 0)
    if (!hash) return// console.log('任务队列为空!')
    let infoStr = await redis.get(hash)
	if (!infoStr) {
		redis.lpop('encode_queue')
        redis.del(hash)
        return
    }
    let info = JSON.parse(infoStr)

    encode(info, hash)
})

module.exports = mediaEncode