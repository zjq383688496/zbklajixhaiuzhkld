const router = require('koa-router')()
const { media } = require('../../proxy/client')

router.prefix('/client')

router
	// 视频相关
	.get('/video/:code',  media.detail)
	.post('/video/:code/:url', media.video)

module.exports = router