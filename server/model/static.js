const fs = require('fs')
const { path } = require('../config')

// const { path } = require('../config')
// const { resource } = path

const live = {
	read: async (ctx, next) => {
		const { id, q, filename } = ctx.params

		return next()
		// return ctx.resHandle('0001')

		// if (!id || !q || !filename) return ctx.resHandle('0001')
	}
}

module.exports = live