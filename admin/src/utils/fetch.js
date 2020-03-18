function remote(url, config = {}) {
	return new Promise((resolve, reject) => {
		var newConfig = Object.assign({ method: 'GET' }, config)
		fetch(url, newConfig).then(response => response.json()).then(({ code, data, msg }) => {
			if (code === '0000') {
				resolve(data)
			} else {
				// message.error(msg)
				reject(msg)
			}
		}).catch(error => {
			// message.error(error.message)
			reject(error.message)
		})
	})
}

module.exports = {
	get: (url, query = {}) => {
		var queryArr = []
		Object.keys(query).forEach(key => queryArr.push(`${key}=${query[key]}`))
		if (queryArr.length) url += ((/\?/.test(url)? '&': '?') + queryArr.join('&'))
		return remote(url)
	},
	post: (url, config = {}) => {
		return remote(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(config),
			// credentials: 'include'
		})
	},
	postFile: (url, file, config = {}, onProgress) => {
		return new Promise((resolve, reject) => {
			var xhr      = new XMLHttpRequest()
			var formData = new FormData()
			formData.append('file', file)

			Object.keys(config).forEach(key => {
				let val = config[key]
				if (val) formData.append(key, val)
			})
			
			xhr.onload = e => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					var { responseText, status, statusText } = xhr
					try {
						var { code, data, msg } = JSON.parse(responseText)
						if (code === '0000') resolve(data)
						else reject(msg)
					} catch(err) {
						reject(err.message)
					}
				} else {
					reject('status: ', xhr.statusText)
				}
			}
			if (onProgress) xhr.upload.onprogress = onProgress
			xhr.open('post', url, true)
			xhr.send(formData)
		})
	},
	delete: (url, config = {}) => {
		return remote(url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(config),
			// credentials: 'include'
		})
	},
	put: (url, config = {}) => {
		return remote(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(config),
			// credentials: 'include'
		})
	}
}