const mysql = require('mysql2')
const connection = mysql.createConnection({
	host: '10.1.106.239',
	user: 'root',
	password: 'zjqzjqzjq',
	database: 'play',
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