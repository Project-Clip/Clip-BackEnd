//var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
var mysql = require('mysql');
var Video = require('./Video.js');

var con = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '111111',
	database: 'webdrama',
	charset: 'utf8mb4',
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');
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

	con.query(sql, params, function (err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log(rows);
		}
	});
});
