let { task } = global
let { media_encode } = task
const { getMediaInfo, trackSeparate } = require('../../utils/video')

async function parse({ parentId, path }, hash) {
    media_encode.encodeState = true
    let info = await getMediaInfo(path)
    let tracks = await trackSeparate(info, path, hash)
	console.log(info)
}

module.exports = parse