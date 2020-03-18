function user() {
	return new Promise((resolve, reject) => {
		let stores = {}
		window.uif = stores
		Ajax.postJSON('/easy-roa/v1/user/getRyUser', {
			ryst: getCookie('RYST'),
			bsst: getCookie('BSST'),
			channel: '002'
		}).then(({ data }) => {
			var { authorities, userInfo } = data,
				authIndexs = {}
			
			stores.auths = authorities
			stores.userInfo = userInfo

			authorities.forEach(key => authIndexs[key] = true)

			Object.assign(stores, { authIndexs })
			resolve(stores)
		})
	})
}
module.exports = user