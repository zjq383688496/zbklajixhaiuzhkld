const { exec, spawn } = require('child_process')

function _spawn(cmd, args = [], options = {}) {
	return new Promise(res => {
		let str = ''
		const ls = spawn(cmd, args.split(/\s+/), options)
		ls.stdout.on('data', (data) => str += data)
		ls.on('close', code => {
			res(str)
		})
	})
}

function _exec(cmd, options = {}) {
	return new Promise(res => {
		exec(cmd, options, (error, stdout, stderr) => {
			if (error) {
				console.error(`执行的错误: ${error}`)
				return res()
			}
			if (stdout) res(stdout)
		})
	})
}

module.exports = {
    spawn: _spawn,
    exec: _exec
}