const router = require('koa-router')()
const { videos } = require('../../model')

router.prefix('/admin')

router
	// 视频相关
	.get('/videos',      videos.list)
	.put('/videos',      videos.create)
	.get('/videos/:id',  videos.detail)
	.post('/videos/:id', videos.update)
	.del('/videos/:id',  videos.delete)

module.exports = router