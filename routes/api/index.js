// const config = require('../../config')
const router = require('koa-router')()

const live = require('./live')

router.prefix('/api')

router.use(live.routes(), live.allowedMethods())

module.exports = router