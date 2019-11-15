const upyun    = require('upyun')
const fs       = require('fs')
const hashFile = require('./hashfile')
const config   = require('../config')
const { envPath, imgPath, ypHost }   = config
const { bucket, user, pass } = config.upyun
const service = new upyun.Service(bucket, user, pass)
const client  = new upyun.Client(service)


const UY = {
	putImage(remotePath = '', filePath, cb) {
		hashFile(filePath, (err, newFileName, newFilePath, buf) => {
			if (err) return cb && cb(err)
			var dir = `${envPath}${remotePath}/${newFileName}`
			var stream = fs.createReadStream(newFilePath)
			client.putFile(dir, stream).then((res) => {
				fs.unlinkSync(newFilePath)
				if (!res) return cb && cb(!res)
				res.url = ypHost + dir
				cb && cb(null, res)
			})
		})
	},
	usage(path) {
		client.usage(path).then(size => {
			console.log(path)
			console.log(`size: ${size}`)
		})
	},
	listDir(path) {
		client.listDir(path).then(({ files }) => {
			console.log(files)
		})
	}
}

module.exports = UY