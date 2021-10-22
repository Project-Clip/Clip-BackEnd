//var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
const mysql = require('mysql');
const Video = require('./Video.js');

//Connection 정의
//RDS에서 설정한 데이터베이스 정보
const connection = mysql.createConnection({
	host: 'clip-database.ct8ohl7ukbal.ap-northeast-2.rds.amazonaws.com',
	user: 'admin',
	password: 'qlalfqjsgh486',
	database: 'test',
});

//RDS 접속
connection.connect(function (err) {
	if (err) {
		throw err;
	} else {
		connection.query('SELECT * FROM EPISODE_VIDEO', function (err, rows, fields) {
			console.log(rows); //결과 출력
		});
	}
});

Video.Data(function (response) {
	let data = response.snippet;
	let likecount = response.statistics;
	var sql = 'INSERT INTO episode_video(title, description, channelId, likeCount) VALUES(?,?,?,?)';
	var params = [];
	params.push(data.title);
	params.push(data.description);
	params.push(data.channelId);
	params.push(likecount.likeCount);
	console.log(params);

	connection.query(sql, params, function (err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log(rows);
		}
	});
});
