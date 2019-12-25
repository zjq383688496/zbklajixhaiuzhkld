const router = require('koa-router')()
const { static } = require('../model')

router.prefix('/static')

router.get('/:id/:q/:filename', static.read)

module.exports = router