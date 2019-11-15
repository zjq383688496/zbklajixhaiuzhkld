const mysql = require('mysql2')
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'zjqzjqzjq',
	database: 'rtmp',
})

module.exports = {
	mysql: connection,
	query: sql => {
		return new Promise(res => {
			connection.query(sql, (err, results, fields) => {
				res({ err, results, fields })
			})
		})
	}
}