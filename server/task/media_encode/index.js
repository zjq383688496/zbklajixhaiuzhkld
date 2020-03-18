const schedule = require('node-schedule')
const { redis, task } = global
const parse = require('./parse')

let { media_encode } = task
media_encode.encodeState = false
let mediaEncode = schedule.scheduleJob('*/10 * * * * *', async () => {
    if (media_encode.encodeState) return console.log('当前有正在编码的任务!')
    let hash = await redis.lindex('task_queue', 0)
    if (!hash) return console.log('任务队列为空!')
    let info = await redis.get(hash)
	if (!info) {
		redis.lpop('task_queue')
		redis.del(hash)
	}
    parse(JSON.parse(info), hash)
    console.log(info)
})

module.exports = mediaEncode