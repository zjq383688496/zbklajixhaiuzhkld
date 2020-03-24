const Koa     = require('koa')
const json    = require('koa-json')
const onerror = require('koa-onerror')
const body    = require('koa-body')
const logger  = require('koa-logger')
const path    = require('path')
const app     = new Koa()

const sequelize = require('./models')
const redis     = require('./redis/admin')

// 错误处理
onerror(app)

// 中间件
app.use(body({
	multipart: true,
	formidable: {
		maxFileSize: 10 * 1024 * 1024 * 1024,
		hash: 'md5',
		uploadDir: path.resolve(__dirname, './.tmp')
	}
}))
app.use(json())
app.use(logger())

global.sequelize = sequelize
global.redis = redis
// 路由
// console.log(path.resolve(__dirname, './.encode'))
// debugger
// app.use(require('koa-static')(path.resolve(__dirname, './.encode'), {
// 	hidden: true,
// 	// defer: true
// }))
require('./config.routes')(app, 'admin')

module.exports = app
