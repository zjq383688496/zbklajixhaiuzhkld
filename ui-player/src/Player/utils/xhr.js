// Ajax
export function xhr(url, options = {}) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest()
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
		xhr.send()
	})
}
