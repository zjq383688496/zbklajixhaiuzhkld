const schedule  = require('node-schedule')
const { redis, task } = global
const parse = require('./parse')

let { media_parse } = task
media_parse.state = false
let mediaParse = schedule.scheduleJob('*/30 * * * * *', async () => {
    if (media_parse.state) return// console.log('当前有正在解析的任务!')
    let code = await redis.lindex('task_queue', 0)
    if (!code) return// console.log('任务队列为空!')
    let infoStr = await redis.get(code)
	if (!infoStr) {
		redis.lpop('task_queue')
        redis.del(code)
        return
    }
    let info = JSON.parse(infoStr)
    console.log('开始解析!')
    parse(info, code)
})

module.exports = mediaParse