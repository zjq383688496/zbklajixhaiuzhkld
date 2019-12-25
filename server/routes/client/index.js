const router = require('koa-router')()
const { hls } = require('../model')

router.prefix('/hls')

router.get('/:id/:q/:filename', hls.read)

module.exports = router