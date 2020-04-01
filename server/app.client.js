const Koa        = require('koa')
const json       = require('koa-json')
const onerror    = require('koa-onerror')
const body       = require('koa-body')
const logger     = require('koa-logger')
// const wsServer   = require('./wsServer')
// const app        = wsServer(new Koa())
const app        = new Koa()

const sequelize = require('./models')

// 错误处理
onerror(app)

// 中间件
app.use(body({
	multipart: true,
}))
app.use(json())
app.use(logger())

global.sequelize = sequelize
// 路由
// app.use(require('koa-static')(__dirname + '/tmp', {
// 	hidden: true,
// 	defer: true
// }))
require('./config.routes')(app, 'client')

module.exports = app
