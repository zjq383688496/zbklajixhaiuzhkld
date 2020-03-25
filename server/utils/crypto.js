const crypto = require('crypto')
const { __salt } = require('../config')
const { random } = Math

function salt(data) {
    var hmac = crypto.createHash('sha512', __salt)
    hmac.update(data)
    return hmac.digest('base64')
}

module.exports = {
    salt
}

function createSalt(num = 64) {
    let key = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        len = key.length

    return new Array(num).fill().map(_ => key[random() * 62 >> 0]).join('')
}