const router = require('koa-router')()
const { media } = require('../../proxy/admin')

router.prefix('/admin')

router
	// 视频相关
	.get('/videos',         media.list)
	.post('/videos',        media.create)
	.get('/videos/:id',     media.detail)
	.post('/videos/upload', media.upload)
	.post('/videos/:id',    media.update)
	.get('/:hash/:quality/:name', media.video)
	// .del('/videos/:id',  media.delete)

module.exports = router