//var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
const mysql = require('mysql');
var Video = require('./video.js');
var PlaylistItem = require('./playlistItem.js');
var Playlist = require('./playlist.js');
var {response} = require('express');
// const exports = (module.exports = {});

// Playlist.Data(undefined, function (response) {
// 	console.log('가져온 정보입니다. : ' + response[0].snippet.title); //반복문으로 돌려두면 됩니다.
// 	NoNameFunc(response);
// });
//기존 sqlconnection.js script
const connection = mysql.createConnection({
	host: 'clip-database.ct8ohl7ukbal.ap-northeast-2.rds.amazonaws.com',
	user: 'admin',
	password: 'qlalfqjsgh486',
	database: 'Webdrama', //charset설정은 따로 불가능한지..?
});

/*connection.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');
});*/

//RDS 접속
connection.connect(function (err) {
	if (err) {
		throw err;
	} else {
		connection.query('SELECT * FROM Webdrama', function (err, rows, fields) {
			console.log(rows); //결과 출력
		});
	}
});

/*NoNameFunc = (response, apicode) => {
	//아직 이름을 못지어 주었습니다.. Playlist와 PlaylisItem의 정보가 50개 이상일 떄 동작하는 함수입니다.
	let pagetoken = undefined;
	if (response.length == 50) {
		console.log('요청한 정보가 50개 이상입니다.');
		pagetoken = 'CGQQAA';
		//	console.log(apicode);	//apicode확인
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
};*/

PlayList = (token, key) => {
	//이게 애초에 50개 이하면 어쩌려고..?
	const apicode = 'playlist';
	console.log('token입니다. ' + token);
	Playlist.Data(token, function (response) {
		//response.data까지 이 이후는 items
		//Module 사용

		// console.log('요청한 정보입니다. : ' + response.items[0].snippet.title);
		console.log('가져온 Token입니다 : ' + response.nextPageToken);
		let sql =
			'INSERT INTO Webdrama_Episodelist(List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES ?;'; //컬럼은 따로 변경 부탁드립니다.
		let datanum = 0;
		let params = [];
		//Request data 등록
		while (datanum < response.items.length) {
			let record = [];
			const data = response.items[datanum].snippet;
			record.push(data.title);
			record.push(data.description);
			record.push(data.publishedAt);
			record.push(data.channelId);
			record.push(data.channelTitle);
			record.push(data.thumbnails.high.url);
			params.push(record);

			datanum++;
		}
		// console.log('주입할 배열입니다. ' + params);
		console.log('주입 결과 : ' + JSON.stringify(params, null, 4));
		/*connection.query(sql, [params], function (err, rows, fields) {
			if (err) {
				console.log(err);
			} else {
				console.log(rows);
			}
		});*/
		//조건문으로 stop 해줍시다.
		return key(response.nextPageToken);
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
			let sql = 'INSERT INTO Webdrama_Upload(Up_id, Up_Channelid, Up_Videoid) VALUES(?,?,?)'; //컬럼은 따로 변경 부탁드립니다.
			let params = [];
			params.push(data.channelId);
			params.push(data.resourceId.videoId);
			console.log(params);

			connection.query(sql, params, function (err, rows, fields) {
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
		let sql = 'INSERT INTO Episode_Video(Ep_id, Title, Description, ChannelId, Like_Count) VALUES(?,?,?,?,?)';
		let params = [];
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
};

function TokenKey(value) {
	console.log(value);
}

// const length = PlayList(undefined);
if (PlayList(undefined, TokenKey) == undefined) {
	console.log(TokenKey);
} else {
	console.log('nextpagetoken값이 undefined가 아닙니다.');
}
// console.log('주입된 결과값입니다.' + PlayList());
