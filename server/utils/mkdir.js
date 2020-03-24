const fs = require('fs')
let { dirname  } = require('../config')
function mkdir(dir, parentDir = '') {
    if (typeof dir === 'string') dir = dir.split('/').filter(_ => _)
    return new Promise(async resolve => {
        let name = dir.shift()
        let dirName = parentDir + '/' + name
        let exists = await fs.existsSync(dirName)
        if (!exists) await fs.mkdirSync(dirName)
        if (!dir.length) return resolve()
        resolve(await mkdir(dir, dirName))
    })
}

module.exports = mkdir