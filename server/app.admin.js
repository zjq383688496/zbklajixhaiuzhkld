const Koa     = require('koa')
const json    = require('koa-json')
const onerror = require('koa-onerror')
const body    = require('koa-body')
const logger  = require('koa-logger')
const path    = require('path')
const app     = new Koa()

// 错误处理
onerror(app)

// 中间件
app.use(body({
	multipart: true,
	formidable: {
		maxFileSize: 200 * 1024 * 1024,
		hash: 'md5',
		uploadDir: path.resolve(__dirname, './.tmp')
	}
}))
app.use(json())
app.use(logger())

// 路由
// app.use(require('koa-static')(__dirname + '/tmp', {
// 	hidden: true,
// 	defer: true
// }))
require('./config.routes')(app, 'admin')

module.exports = app
