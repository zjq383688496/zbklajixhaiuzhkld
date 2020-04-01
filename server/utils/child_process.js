const { exec, spawn } = require('child_process')
const { random } = Math

function _spawn(cmd, args = [], options = {}, hasLog = true) {
	return new Promise(res => {
		let str = '', init = 0, cfg = args.split(/\s+/),
			processId = `process_${random() * 9e8 >> 0}`
		console.log('执行进程: 开始', processId)
		console.log('执行命令: ', cmd, args)
		const ls = spawn(cmd, cfg, options)
		ls.stdout.on('data', data => {
			if (hasLog) str += data
			else console.log(data)
		})
		ls.stderr.on('data', err => {
			// if (!(init % 32)) console.log(`${err}`)
			++init
		})
		ls.on('close', code => {
			console.log('执行进程: 结束', processId)
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