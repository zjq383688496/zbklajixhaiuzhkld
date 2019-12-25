import fetch from 'isomorphic-fetch'

export function fetchPopularRepos (language = 'all') {
	const encodedURI = encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

	return fetch(encodedURI)
		.then(data => data.json())
		.then(repos => repos.items)
		.catch(error => {
			console.warn(error)
			return null
		})
}

// 视频列表
export function videoList() {
	return fetch('http://0.0.0.0:4090/admin/videos')
		.then(data => data.json())
		.then(repos => repos)
		.catch(error => {
			console.warn(error)
			return null
		})
}

// 视频上传
export function videoUpload(file, onProgress) {
	return new Promise((res, rol) => {
		let form = new FormData(),
			xhr  = new XMLHttpRequest()
		xhr.open('put', 'http://0.0.0.0:4090/admin/videos' , true)
		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (xhr.status == 200) {
					let { responseText } = this,
						{ code, msg, data } = JSON.parse(responseText)
					if (code === '0000') return res(data)
					else rol(msg)
				} else {
					rol()
				}
			}

		}
		form.append('file', file)
		xhr.send(form)
		if (onProgress) xhr.onProgress = onProgress
	})
}