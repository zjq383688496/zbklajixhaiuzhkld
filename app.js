const Koa        = require('koa')
const json       = require('koa-json')
const onerror    = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger     = require('koa-logger')
const wsServer   = require('./wsServer')
const app        = wsServer(new Koa())

const config     = require('./config')

// 错误处理
onerror(app)

// 中间件
app.use(bodyparser({
	enableTypes:['json', 'form', 'text'],
	formLimit: '5mb',
	jsonLimit: '5mb',
	textLimit: '5mb',
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 路由
// require('./config.routes')(app)

require('./config.ws')(app)
require('./live')(app)

// error-handling
// app.on('error', (err, ctx) => {
// 	console.error('服务器 错误', err, ctx)
// })

module.exports = app
