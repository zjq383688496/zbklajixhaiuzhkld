const crypto = require('crypto')
const { __salt, __key, __iv } = require('../config')

function salt(data) {
    var hmac = crypto.createHash('sha256', __salt)
    hmac.update(data)
    return hmac.digest('base64')
}

function encrypt(data) {
    const cipher = crypto.createCipheriv('aes-128-cbc', __key, __iv)
    var crypted = cipher.update(data, 'utf8', 'base64')
    crypted += cipher.final('base64')
    return crypted
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', __key, __iv)
    var decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

module.exports = {
    salt,
    encrypt,
    decrypt
}

function createSalt(num = 64) {
    let key = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        len = key.length

    return new Array(num).fill().map(_ => key[Math.random() * 62 >> 0]).join('')
}