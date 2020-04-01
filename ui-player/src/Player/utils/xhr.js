// Ajax
export function xhr(url, options = {}, headers = {}) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		xhr.responseType = options.format || 'json'
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4) return
			if (xhr.status === 200 || xhr.status === 206) {
				resolve(xhr.response)
			} else {
				debugger
			}
		}
		xhr.open('GET', url, true)
		Object.keys(headers).forEach(key => {
			let val = headers[key]
			if (val) xhr.setRequestHeader(key, val)
		})
		xhr.send()
	})
}

export function getMedia(url, body = {}) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		xhr.responseType = 'arraybuffer'
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4) return
			if (xhr.status === 200 || xhr.status === 206) {
				resolve(xhr.response)
			} else {
				debugger
			}
		}
		xhr.open('POST', url, true)
		xhr.setRequestHeader('content-type', 'application/json')
		xhr.send(JSON.stringify(body))
	})
}
