// var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
require('dotenv').config();
const async = require('async');
const Video = require('./video.js');
const PlaylistItem = require('./playlistItem.js');
const Playlist = require('./playlist.js');
const path = require('path');

// connection mysql
//main Server
const mysqlConnection = require(path.join(
  __dirname,
  '..',
  '..',
  'config/mysql.js'
));
const conn = mysqlConnection.init();
mysqlConnection.open(conn);
//Test Server
/*const conn = mysql.createConnection({
  host: 'rdstest.ckc6oubthmz8.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: '2dbstn0309',
  database: 'clip', //charset설정은 따로 불가능한지..?
});*/

//채널 단위 업데이트
ChannelUpdate = (callback) => {
  const nowDate = new Date();
  let hasDate;
  conn.query(
    'select id, channelid, List_Lastupdate from Wd_channelid;',
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log('(ChannleUpdate)현재 일입니다. : ' + nowDate.getDate());
        for (let idNum = 0; idNum < rows.length; idNum++) {
          const channelId = rows[idNum].channelid;
          hasDate = new Date(rows[idNum].List_Lastupdate);
          hasDate.setHours(hasDate.getHours() + 9);
          // hasDate.setHours(hasDate.getHours() - 24); //test code
          console.log(
            channelId +
              '의 (ChannleUpdate)마지막 업데이트 된 일입니다. : ' +
              hasDate.getDate()
          );
          if (nowDate.getDate() === hasDate.getDate()) {
            //현재 시간과 업뎃 시간이 같다면
            continue;
          } else {
            PlayList(undefined, channelId);
            UpdateTime('Wd_channelid', 'channelid', channelId);
          }
        }
        return callback(null, nowDate);
      }
    }
  );
};

//웹드라마 업데이트
DramaUpdate = (nowDate, callback) => {
  let hasDate;
  conn.query(
    'select List_Playlistid, List_Lastupdate from Webdrama_Episodelist;',
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log('(DramaUpdate)현재 일입니다. : ' + nowDate.getDate());
        for (let idNum = 0; idNum < rows.length; idNum++) {
          const dramaId = rows[idNum].List_Playlistid;
          hasDate = new Date(rows[idNum].List_Lastupdate);
          hasDate.setHours(hasDate.getHours() + 9);
          // hasDate.setHours(hasDate.getHours() - 24); //test code
          console.log(
            dramaId +
              '의 (DramaUpdate)마지막 업데이트 된 일입니다. : ' +
              hasDate.getDate()
          );
          if (nowDate.getDate() === hasDate.getDate()) {
            //현재 시간과 업뎃 시간이 같다면?
            continue;
          } else {
            PlayListItem(undefined, dramaId);
            UpdateTime('Webdrama_Episodelist', 'List_Playlistid', dramaId);
          }
        }
        return callback(null, nowDate);
      }
    }
  );
};

//동기 처리
async.waterfall([ChannelUpdate, DramaUpdate], (err, result) => {
  if (err) {
    console.log('에러입니다 : ' + err);
  } else {
    console.log('스케쥴러 완료');
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

UpdateTime = (tableName, column, id) => {
  conn.query(
    `UPDATE ${tableName} SET List_Lastupdate = NOW() WHERE ${column} = '${id}';`,
    (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        console.log('채널 업데이트 완료...' + JSON.stringify(rows, null, 4));
        const test = rows.changedRows;
        console.log('(UpdateTime)업데이트 데이터 수 : ' + test);
      }
    }
  );
};
