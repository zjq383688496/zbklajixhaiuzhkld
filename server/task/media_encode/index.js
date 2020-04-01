const schedule  = require('node-schedule')
const { redis, task } = global
const encode = require('./encode')

let { media_encode } = task
let mediaEncode = schedule.scheduleJob('*/10 * * * * *', async () => {
    if (media_encode.state) return// console.log('当前有正在编码的任务!')
    let code = await redis.lindex('encode_queue', 0)
    if (!code) return// console.log('任务队列为空!')
    let infoStr = await redis.get(code)
	if (!infoStr) {
		redis.lpop('encode_queue')
        redis.del(code)
        return
    }
    let info = JSON.parse(infoStr)
    console.log('开始编码!')
    encode(info, code)
})

module.exports = mediaEncode