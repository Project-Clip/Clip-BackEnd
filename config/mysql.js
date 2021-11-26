const mysql = require('mysql');

const mysqlConnection = {
	init: function () {
		return mysql.createConnection({
			host: process.env.host,
			port: process.env.port,
			user: process.env.user,
			password: process.env.password,
			database: process.env.database,
		});
	},
	open: function (con) {
		con.connect((err) => {
			if (err) {
				console.log('MySQL 연결 실패 : ', err);
			} else {
				console.log('MySQL Connected!!!');
			}
		});
	},
	close: function (con) {
		con.end((err) => {
			if (err) {
				console.log('MySQL 종료 실패 : ', err);
			} else {
				console.log('MySQL Terminated...');
			}
		});
	},
};
module.exports = mysqlConnection;
