// var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
require('dotenv').config();
const async = require('async');
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
  database: 'test', // charset설정은 따로 불가능한지..?
});
//Test Server
/*const conn = mysql.createConnection({
  host: 'rdstest.ckc6oubthmz8.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: '2dbstn0309',
  database: 'clip', //charset설정은 따로 불가능한지..?
});*/

//채널 단위 업데이트
ChannelRequest = (callback) => {
  const nowDate = new Date();
  let hasDate;
  conn.query(
    //Wd_channelid에서 채널id 추출
    'select id, channelid, date_time from Wd_channelid;',
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        // console.log('ChannelRequest : ' + JSON.stringify(rows, null, 4));
        const channelNum = []; // 변경 필요한 id 넘버
        console.log('현재 일입니다. : ' + nowDate.getDate());
        for (let idNum = 0; idNum < rows.length; idNum++) {
          //채널 수만큼 반복
          hasDate = new Date(rows[idNum].date_time);
          hasDate.setHours(hasDate.getHours() + 9);
          console.log('마지막 업데이트 된 일입니다. : ' + hasDate.getDate());
          if (nowDate.getDate() === hasDate.getDate()) {
            //현재 시간과 업뎃 시간이 같다면?
            continue;
          } else {
            const channelId = rows[idNum].channelid;
            const uniqueId = rows[idNum].id;
            channelNum.push(uniqueId);
            PlayList(undefined, channelId);
          }
        }
        return callback(null, channelNum);
      }
    }
  );
};

ChannelUpdate = (id, callback) => {
  // id.length만큼 반복 돌려서 따로 함수화 시키면 가능할 듯?
  console.log('업데이트가 된 채널입니다. : ' + id);
  conn.query(
    `UPDATE Wd_channelid SET date_time = NOW() WHERE id = 2;`,
    (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        console.log('채널 업데이트 완료...' + JSON.stringify(rows, null, 4));
        const test = rows.changedRows;
        console.log('업데이트 데이터 : ' + test);
      }
    }
  );
};

//동기 처리
async.waterfall([ChannelRequest, ChannelUpdate], (err, result) => {
  if (err === null) {
    console.log('스케쥴러 완료');
  } else {
    console.log('에러입니다 : ' + err);
  }
});

// playlist Module을 사용하는 함수입니다.
PlayList = (token, id) => {
  Playlist.Data(token, id, (response) => {
    // console.log('PlayList : ' + JSON.stringify(response, null, 4));
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
PlayListItem = (token, id) => {
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
Videofunc = (id) => {
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
