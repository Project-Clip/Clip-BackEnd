const mysql = require('mysql');

module.exports = function (app, conn) {
	app.get('/', function (req, res) {
		console.log('현재 /를 요청중입니다.');
		res.send('연결성공!!');
	});

	app.get('/webdramalist', function (req, res) {
		conn.query('SELECT * FROM Webdrama_Episodelist;', function (err, rows, fields) {
			if (err) {
				throw err;
			} else {
				console.log('GET Method 정상작동.' + JSON.stringify(rows, null, 4));
				res.send(rows);
			}
		});
	});

	app.get('/webdramalist/:id', function (req, res) {
		if (id == undefined) {
			res.send('ID 입력바람');
		} else {
			const dramaId = req.params.id;
			conn.query('SELECT * FROM Webdrama_Episodelist WHERE List_id =' + dramaId + ';', function (err, rows, fields) {
				if (err) {
					throw err;
				} else {
					console.log('GET Method 정상작동.' + JSON.stringify(rows, null, 4));
					res.send(rows);
				}
			});
		}
	});
};
