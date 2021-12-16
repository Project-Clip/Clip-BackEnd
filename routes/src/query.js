// var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
const mysql = require('mysql');
const Video = require('./video.js');
const PlaylistItem = require('./playlistItem.js');
const Playlist = require('./playlist.js');
const async = require('async');

// connection mysql
const conn = mysql.createConnection({
  host: 'clip-database.ct8ohl7ukbal.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'qlalfqjsgh486',
  database: 'Webdrama', // charset설정은 따로 불가능한지..?
});

// playlist Module을 사용하는 함수입니다.
PlayList = (token) => {
  Playlist.Data(token, (response) => {
    // response.data까지 이 이후는 items
    // Module 사용

    console.log('가져온 Token입니다 : ' + response.nextPageToken);
    const sql =
      'INSERT IGNORE INTO Webdrama_Episodelist(List_Playlistid, List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES ?;'; // 컬럼은 따로 변경 부탁드립니다.
    let datanum = 0;
    const params = [];
    // Request data 등록
    while (datanum < response.items.length) {
      const record = [];
      const data = response.items[datanum];
      const snippet = response.items[datanum].snippet;
      record.push(
        data.id,
        snippet.title,
        snippet.description,
        snippet.publishedAt,
        snippet.channelId,
        snippet.channelTitle,
        snippet.thumbnails.high.url
      );
      params.push(record);

      datanum++;
    }

    // console.log('주입 결과 : ' + JSON.stringify(params, null, 4));
    conn.query(sql, [params], (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
  });
};

// playlistItem Module을 사용하는 함수입니다.
PlayListItem = (token, id) => {
  async.waterfall([
    function (callback) {
      PlaylistItem.Data(token, id, (response) => {
        // console.log('가져온 정보입니다. : ' + response[2].snippet.resourceId.videoId); //반복문으로 돌려두면 됩니다.
        // Request data 등록
        let datanum = 0;
        const sql =
          'INSERT IGNORE INTO Webdrama_Upload(Up_Playlistid, Up_Channelid, Up_Videoid) VALUES?;'; // 컬럼은 따로 변경 부탁드립니다.
        const params = [];
        while (datanum < response.length) {
          const record = [];
          const data = response[datanum].snippet;
          record.push(id);
          record.push(data.channelId);
          record.push(data.resourceId.videoId);
          params.push(record);

          datanum++;
        }
        console.log('주입 결과 : ' + JSON.stringify(params, null, 4));

        conn.query(sql, [params], function (err, rows, fields) {
          if (err) {
            console.log(err);
          } else {
            console.log(rows);
            callback();
          }
        });
      });
    },
  ]);
};

// Video Module을 사용하는 함수입니다.
Videofunc = (id) => {
  Video.Data(id, (response) => {
    console.log('가져온 정보입니다.' + response);
    const data = response.snippet;
    const likecount = response.statistics;
    const sql =
      'INSERT IGNORE INTO Episode_Video(Videoid, Title, Description, ChannelId, Like_Count) VALUES?;';
    const params = [];
    const record = [];
    record.push(id);
    record.push(data.title);
    record.push(data.description);
    record.push(data.channelId);
    record.push(likecount.likeCount);
    params.push(record);

    console.log('주입 결과 : ' + JSON.stringify(params, null, 4));

    conn.query(sql, [params], function (err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
  });
};

// 함수 실행단입니다.
PlayList(undefined);
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
