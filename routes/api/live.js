const fs = require('fs')
const { live } = require('../../model')
const router = require('koa-router')()

router.prefix('/live')

router.get('/list', live.list)

module.exports = router