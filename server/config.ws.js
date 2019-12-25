const route = require('koa-route')

const WS = global.WS = {}

module.exports = app => {
	// websocket相关
	app.ws.use(function(ctx, next) {
		return next(ctx)
	})

	/* 上传进度条 */
	// 客户端
	app.ws.use(route.all('/updata', ({ websocket }) => {
		WS.upClient = websocket
		websocket.on('message', msg => {
			if (msg === 'getCurrentInfo' && global.LIVE.currentInfo) websocket.send(JSON.stringify(global.LIVE.currentInfo))
		})
	}))

}
