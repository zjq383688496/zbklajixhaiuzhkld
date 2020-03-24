const path       = require('path')
const fs         = require('fs')
const Koa        = require('koa')
const json       = require('koa-json')
const onerror    = require('koa-onerror')
const static     = require('koa-static')
const app        = new Koa()

const config     = require('./config')

// 错误处理
// onerror(app)

// 中间件
// app.use(json())
// app.use(logger())

// 路由
let encodePath = path.resolve(__dirname, './.encode/')
console.log(encodePath)
fs.stat(encodePath, err => {
	console.log(err)
})
app.use(static(encodePath))
// require('./config.routes')(app, 'static')


// error-handling
// app.on('error', (err, ctx) => {
// 	console.error('服务器 错误', err, ctx)
// })

module.exports = app
