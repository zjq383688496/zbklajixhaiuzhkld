const Redis = require('ioredis')
const redis = new Redis({
	port: 6383,
	host: '127.0.0.1',
	// prefix: 'rt:',
	db: 0
})

module.exports = redis