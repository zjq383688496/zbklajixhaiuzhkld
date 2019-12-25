const config = require('./config')
const { resHandle } = require('./utils')

module.exports = (app, type) => {
	const API = require(`./routes/${type}`)
	// 允许跨域
	// 添加请求处理时间(ms)
	app.use(async (ctx, next) => {
		const start = Date.now()
		ctx.set('Access-Control-Allow-Credentials', true)
		ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
		ctx.set('Access-Control-Allow-Origin',  '*')
		ctx.set('Access-Control-Allow-Methods', 'POST, PUT')
		ctx.set('Access-Control-Max-Age', 3600)
		if (ctx.method === 'OPTIONS') return ctx.body = ''
		ctx.cfg = config
		ctx.resHandle = resHandle.bind(ctx)
		await next()
		const ms = Date.now() - start
		ctx.set('x-execution-time', `${ctx.method} ${ctx.url} - ${ms}ms`)
	})

	app.use(API.routes(), API.allowedMethods())
}
