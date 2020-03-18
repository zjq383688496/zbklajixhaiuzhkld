Object.assign(window, {
	rn(num = 1) {
		return Math.random() * num >> 0
	},
	// 判断对象是否为空
	isEmptyObject(obj) {
		try {
			return !Object.keys(obj).length
		} catch(e) {
			return false
		}
	},
	// 深拷贝
	deepCopy(obj) {
		if (true) {}
		try {
			return JSON.parse(JSON.stringify(obj))
		} catch(e) {
			console.error(e)
			return obj
		}
	},
	Timeout(cb, time = 1000 / 60) {
		return new Promise(res => {
			let t = setTimeout(() => {
				clearTimeout(t)
				res()
			}, time)
		})
	},
	// 获取对象的真实类型
	__getClass(obj) {
		return Object.prototype.toString.call(obj).slice(8, -1)
	},
	Fetch: require('./fetch')
})
