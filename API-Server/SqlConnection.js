//var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
var mysql = require('mysql');
var Video = require('./Video.js');
var PlaylistItem = require('./PlaylistItem.js');
var Playlist = require('./Playlist.js');
const {response} = require('express');
var exports = (module.exports = {});

// Playlist.Data(undefined, function (response) {
// 	console.log('가져온 정보입니다. : ' + response[0].snippet.title); //반복문으로 돌려두면 됩니다.
// 	NoNameFunc(response);
// });
//기존 sqlconnection.js script
var con = mysql.createConnection({
	host: '127.31.13.7',
	user: 'admin',
	password: 'qlalfqjsgh486',
	database: 'webdrama',
	charset: 'utf8mb4',
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');
});

NoNameFunc = (response, apicode) => {
	//아직 이름을 못지어 주었습니다.. Playlist와 PlaylisItem의 정보가 50개 이상일 떄 동작하는 함수입니다.
	console.log(response.length);
	let pagetoken = undefined;
	if (response.length == 50) {
		console.log('요청한 정보가 50개 이상입니다.');
		pagetoken = 'CDIQAA';
		console.log(apicode);
		if (apicode == 'playlist') {
			PlayList(pagetoken);
		} else if (apicode == 'playlistitem') {
			PlayListItem(pagetoken);
		}
	} else {
		console.log('요청한 정보가 50개 이하입니다.');
		// console.log(response)
		PlayList(pagetoken);
	}
};

PlayList = (token) => {
	//이게 애초에 50개 이하면 어쩌려고..?
	const apicode = 'playlist';
	console.log('token입니다. ' + token);
	Playlist.Data(token, function (response) {
		console.log('가져온 정보입니다. : ' + response[0].snippet.title); //반복문으로 돌려두면 됩니다.

		//Request data 등록
		let datanum = 0;
		while (datanum < response.length) {
			let data = response[datanum].snippet;
			var sql =
				'INSERT INTO webdrama_main_episodelist(List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES(?,?,?,?,?,?)'; //컬럼은 따로 변경 부탁드립니다.
			var params = [];
			params.push(data.title);
			params.push(data.description);
			params.push(data.publishedAt);
			params.push(data.channelId);
			params.push(data.channelTitle);
			params.push(data.thumbnails.high.url);
			console.log(params);

			con.query(sql, params, function (err, rows, fields) {
				if (err) {
					console.log(err);
				} else {
					console.log(rows);
				}
			});
		}
		//조건문으로 stop 해줍시다.
		if (response.length == 50) {
			//조회데이터가 50개 이상일 경우
			NoNameFunc(response, apicode);
		}
	});
};

PlayListItem = (token) => {
	const apicode = 'playlistitem';
	PlaylistItem.Data(token, function (response) {
		console.log('가져온 정보입니다. : ' + response[2].snippet.resourceId.videoId); //반복문으로 돌려두면 됩니다.

		//Request data 등록
		let datanum = 0;
		while (datanum < response.length) {
			let data = response[datanum].snippet;
			let sql = 'INSERT INTO upload(Up_id, Up_video_id) VALUES(?,?)'; //컬럼은 따로 변경 부탁드립니다.
			let params = [];
			params.push(data.channelId);
			params.push(data.resourceId.videoId);
			console.log(params);

			con.query(sql, params, function (err, rows, fields) {
				if (err) {
					console.log(err);
				} else {
					console.log(rows);
				}
			});
		}
		if (response.length == 50) {
			//조회데이터가 50개 이상일 경우
			NoNameFunc(response, apicode);
		}
	});
};

Video = () => {
	const apicode = 'video';
	Video.Data(token, function (response) {
		console.log('가져온 정보입니다.' + response);
		let data = response.snippet;
		let likecount = response.statistics;
		let sql = 'INSERT INTO episode_video(title, description, channelId, likeCount) VALUES(?,?,?,?)';
		let params = [];
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
};

PlayList(undefined);
// PlayListItem(undefined);
