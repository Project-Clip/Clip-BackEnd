//var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
const mysql = require('mysql');
var Video = require('./video.js');
var PlaylistItem = require('./playlistItem.js');
var Playlist = require('./playlist.js');
var {response} = require('express');
// const exports = (module.exports = {});

//connection mysql
const connection = mysql.createConnection({
	host: 'clip-database.ct8ohl7ukbal.ap-northeast-2.rds.amazonaws.com',
	user: 'admin',
	password: 'qlalfqjsgh486',
	database: 'Webdrama', //charset설정은 따로 불가능한지..?
});

//playlist Module을 사용하는 함수입니다.
PlayList = (token) => {
	Playlist.Data(token, function (response) {
		const apicode = 'playlist';
		//response.data까지 이 이후는 items
		//Module 사용

		console.log('가져온 Token입니다 : ' + response.nextPageToken);
		let sql =
			'INSERT INTO Test(List_Playlistid, List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES ?;'; //컬럼은 따로 변경 부탁드립니다.
		let datanum = 0;
		let params = [];
		//Request data 등록
		while (datanum < response.items.length) {
			//데이터 주입 반복.
			let record = [];
			const data = response.items[datanum];
			record.push(data.id);
			record.push(data.snippet.title);
			record.push(data.snippet.description);
			record.push(data.snippet.publishedAt);
			record.push(data.snippet.channelId);
			record.push(data.snippet.channelTitle);
			record.push(data.snippet.thumbnails.high.url);
			params.push(record);

			datanum++;
		}
		console.log('주입 결과 : ' + JSON.stringify(params, null, 4));
		connection.query(sql, [params], function (err, rows, fields) {
			if (err) {
				console.log(err);
			} else {
				console.log(rows);
			}
		});
	});
};

//playlistItem Module을 사용하는 함수입니다.
PlayListItem = (token, id) => {
	const apicode = 'playlistitem';
	PlaylistItem.Data(token, id, function (response) {
		// console.log('가져온 정보입니다. : ' + response[2].snippet.resourceId.videoId); //반복문으로 돌려두면 됩니다.

		//Request data 등록
		let datanum = 0;
		let sql = 'INSERT INTO Test_Upload(Up_Playlistid, Up_Channelid, Up_Videoid) VALUES?;'; //컬럼은 따로 변경 부탁드립니다.
		let params = [];
		while (datanum < response.length) {
			let record = [];
			let data = response[datanum].snippet;
			record.push(id);
			record.push(data.channelId);
			record.push(data.resourceId.videoId);
			params.push(record);

			datanum++;
		}
		console.log('주입 결과 : ' + JSON.stringify(params, null, 4));

		connection.query(sql, [params], function (err, rows, fields) {
			if (err) {
				console.log(err);
			} else {
				console.log(rows);
			}
		});
	});
};

//Video Module을 사용하는 함수입니다.
Videofunction = () => {
	const apicode = 'video';
	Video.Data(function (response) {
		console.log('가져온 정보입니다.' + response);
		let data = response.snippet;
		let likecount = response.statistics;
		let sql = 'INSERT INTO Episode_Video(Ep_id, Title, Description, ChannelId, Like_Count) VALUES(?,?,?,?,?)';
		let params = [];
		params.push(data.title);
		params.push(data.description);
		params.push(data.channelId);
		params.push(likecount.likeCount);
		console.log(params);

		// connection.query(sql, params, function (err, rows, fields) {
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		console.log(rows);
		// 	}
		// });
	});
};

//함수 실행단입니다.
PlayList(undefined);
PlayList('CDIQAA');
connection.query('select List_Playlistid from Test', function (err, rows) {
	if (err) {
		console.log(err);
	} else {
		let idNum = 0;
		while (idNum < rows.length) {
			const playlistid = rows[idNum].List_Playlistid;
			PlayListItem(undefined, playlistid);
			idNum++;
		}
	}
});
