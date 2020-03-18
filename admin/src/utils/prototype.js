/* 原型链扩展 */
const extend = require('util')._extend

module.exports = (function (window) {

	/* String */
	extend(String.prototype, {
		getByteLength() {
			return this.replace(/[^\x00-\xff]/g, 'aa').length
		}
	})

	/* Array */
	extend(Array.prototype, {
		remove(val) {
			return this.filter(_ => _ !== val)
		},
		removeByIdx(idx) {
			var attr = getAttr(idx)
			if (attr === 'Number') {
				return this.filter((_, i) => i !== idx)
			} else if (attr === 'Array') {
				return this.filter((_, i) => idx.indexOf(i) < 0)
			}
		}
	})

}(window))