const router = require('koa-router')()
const { media } = require('../../proxy')

router.prefix('/admin')

router
	// 视频相关
	.get('/videos',      media.list)
	.post('/videos',      media.create)
	.get('/videos/:id',  media.detail)
	.post('/videos/upload',  media.upload)
	// .post('/videos/:id', media.update)
	// .del('/videos/:id',  media.delete)

module.exports = router