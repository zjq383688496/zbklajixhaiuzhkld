const schedule  = require('node-schedule')
const { redis, task } = global
const parse = require('./parse')

let { media_parse } = task
media_parse.parseState = false
let mediaParse = schedule.scheduleJob('*/30 * * * * *', async () => {
    if (media_parse.parseState) return// console.log('当前有正在解析的任务!')
    let hash = await redis.lindex('task_queue', 0)
    if (!hash) return// console.log('任务队列为空!')
    let infoStr = await redis.get(hash)
	if (!infoStr) {
		redis.lpop('task_queue')
        redis.del(hash)
        return
    }
    let info = JSON.parse(infoStr)
    console.log('开始解析!')
    parse(info, hash)
})

module.exports = mediaParse