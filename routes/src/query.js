// var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
const mysql = require('mysql');
const Video = require('./video.js');
const PlaylistItem = require('./playlistItem.js');
const Playlist = require('./playlist.js');

// connection mysql
//main Server
const conn = mysql.createConnection({
  host: 'clip-database.ct8ohl7ukbal.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'qlalfqjsgh486',
  database: 'Webdrama', // charset설정은 따로 불가능한지..?
});
//Test Server
/*const conn = mysql.createConnection({
  host: 'rdstest.ckc6oubthmz8.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: '2dbstn0309',
  database: 'clip', //charset설정은 따로 불가능한지..?
});*/

// playlist Module을 사용하는 함수입니다.
exports.PlayList = (token) => {
  Playlist.Data(token, (response) => {
    const sql =
      'INSERT IGNORE INTO Webdrama_Episodelist(List_Playlistid, List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES ?;'; // 컬럼은 따로 변경 부탁드립니다.
    conn.query(sql, [response], (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
  });
};

// playlistItem Module을 사용하는 함수입니다.
exports.PlayListItem = (token, id) => {
  PlaylistItem.Data(token, id, (response) => {
    const sql =
      'INSERT IGNORE INTO Webdrama_Upload(Up_Playlistid, Up_Channelid, Up_Videoid) VALUES?;'; // 컬럼은 따로 변경 부탁드립니다.

    conn.query(sql, [response], function (err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
  });
};

// Video Module을 사용하는 함수입니다.
exports.Videofunc = (id) => {
  Video.Data(id, (response) => {
    const sql =
      'INSERT IGNORE INTO Episode_Video(Videoid, Title, Description, ChannelId, Like_Count) VALUES?;';

    conn.query(sql, [response], function (err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
  });
};

// 함수 실행단입니다.
// PlayList('CDIQAA');

// PlaylistItem 실행
/* connection.query('select List_Playlistid from Webdrama_Episodelist', function (err, rows) {
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
});*/

// Video실행
// conn.query('select Up_Videoid from Webdrama_Upload', function (err, rows) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		let idNum = 0;
// 		while (idNum < rows.length) {
// 			const videoid = rows[idNum].Up_Videoid;
// 			Videofunc(videoid);
// 			idNum++;
// 		}
// 	}
// });
