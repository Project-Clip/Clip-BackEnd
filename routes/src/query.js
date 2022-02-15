// var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
require('dotenv').config();
const async = require('async');
const Video = require('./video.js');
const PlaylistItem = require('./playlistItem.js');
const Playlist = require('./playlist.js');
const path = require('path');
const schedule = require('node-schedule');

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

////////////////////////////
//스케쥴링 관련 함수
////////////////////////////

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
          if (
            nowDate.getFullYear() === hasDate.getFullYear() &&
            nowDate.getMonth() === hasDate.getMonth() &&
            nowDate.getDate() === hasDate.getDate() &&
            nowDate.getHours() === hasDate.getHours() &&
            //테스트 종료시 삭제 부탁드립니다.
            nowDate.getMinutes() === hasDate.getMinutes()
          ) {
            //현재 시간과 업뎃 시간이 같다면
            continue;
          } else {
            async.waterfall(
              [
                function (callback) {
                  callback(null, undefined, channelId);
                },
                PlayList,
              ],
              function (err, result) {
                if (err) {
                  console.log('에러입니다 : ' + err);
                } else {
                  console.log('Playlist 완료...');
                }
              }
            );
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
          const dramaId = rows[idNum].List_Playlistid; //List_Playlistid
          hasDate = new Date(rows[idNum].List_Lastupdate);
          hasDate.setHours(hasDate.getHours() + 9);
          // hasDate.setHours(hasDate.getHours() - 24); //test code
          console.log(
            dramaId +
              '의 (DramaUpdate)마지막 업데이트 된 일입니다. : ' +
              hasDate.getDate()
          );
          if (
            nowDate.getFullYear() === hasDate.getFullYear() &&
            nowDate.getMonth() === hasDate.getMonth() &&
            nowDate.getDate() === hasDate.getDate() &&
            nowDate.getHours() === hasDate.getHours() &&
            nowDate.getMinutes() === hasDate.getMinutes()
          ) {
            //현재 시간과 업뎃 시간이 같다면?
            continue;
          } else {
            async.waterfall(
              [
                function (callback) {
                  callback(null, undefined, dramaId);
                },
                PlayListItem,
              ],
              function (err, result) {
                if (err) {
                  console.log('에러입니다 : ' + err);
                } else {
                  console.log('PlaylistItem 완료...');
                }
              }
            );
            // PlayListItem(undefined, dramaId);
          }
        }
        return callback(null, nowDate);
      }
    }
  );
};

//드라마 목록 업데이트
DramaListUpdate = (nowDate, callback) => {
  // const dateNow = nowDate.getDate();
  // const hourNow = nowDate.getHours();
  let hasDate;
  conn.query(
    'select Up_Playlistid, Up_Videoid, List_Lastupdate from Webdrama_Upload;',
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log('(DramaListUpdate)현재 일입니다. : ' + nowDate.getDate());
        for (let idNum = 0; idNum < rows.length; idNum++) {
          const videoId = rows[idNum].Up_Videoid;
          hasDate = new Date(rows[idNum].List_Lastupdate);
          hasDate.setHours(hasDate.getHours() + 9);
          // hasDate.setHours(hasDate.getHours() - 24); //test code
          console.log(
            videoId +
              '의 (DramaListUpdate)마지막 업데이트 된 일입니다. : ' +
              hasDate.getDate()
          );
          if (
            nowDate.getDate() === hasDate.getDate() &&
            nowDate.getHours() === hasDate.getHours()
          ) {
            //현재 날짜와 시간과 업뎃 날짜와 시간이 같다면
            Videofunc(videoId);
          } else {
            continue;
          }
        }
        return callback(null);
      }
    }
  );
};

////////////////////////////
//시간 업데이트 관련 함수
////////////////////////////

UpdateTime = (tableName, column, id) => {
  const sql = `UPDATE ${tableName}
     SET List_Lastupdate = NOW()
     WHERE ${column} = '${id}';`;
  conn.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        '(UpdateTime) 채널 업데이트 완료...' + JSON.stringify(rows, null, 4)
      );
      const test = rows.changedRows;
      console.log('(UpdateTime)업데이트 데이터 수 : ' + test);
    }
  });
};

////////////////////////////
//youtubeAPI요청 관련 함수
/*생각해보니까 애들이 콜백 처리 되어있는데 함수로 묶어야만 반복처리가 가능하다고 생각한 내가 참 멍청함
 * 차라리 async쓸 때 조건문에서 새로운 배열에 data를 push하고 그 data를 넘겨주면서 해당 함수 내에서 반복으로 본아가게 만들면
 * 내가 고민했던 요소와 문제를 한번에 처리가 가능해짐 당장내일부터 개선할 예정*/
////////////////////////////

// playlist Module을 사용하는 함수입니다.
PlayList = (token, id, callback) => {
  for (let a = 0; a < 2; a++) {
    Playlist.Data(token, id, (response) => {
      // console.log('PlayList : ' + JSON.stringify(response, null, 4));
      const sql =
        'INSERT IGNORE INTO Webdrama_Episodelist(List_Playlistid, List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES ?;'; // 컬럼은 따로 변경 부탁드립니다.
      conn.query(sql, [response], (err, rows, fields) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Playlist API에서 ' + id + ' 데이터 요청완료...');
        }
      });
    });
  }
  return callback(null);
};

// playlistItem Module을 사용하는 함수입니다.
PlayListItem = (token, id, callback) => {
  PlaylistItem.Data(token, id, (response) => {
    const sql =
      'INSERT IGNORE INTO Webdrama_Upload(Up_Playlistid, Up_Channelid, Up_Videoid) VALUES?;'; // 컬럼은 따로 변경 부탁드립니다.
    conn.query(sql, [response], function (err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log('PlaylistItem API에서 ' + id + ' 데이터 요청완료...');
        console.log(
          'PlaylistItem에서 요청한 데이터 : ' +
            JSON.stringify(rows.affectedRows, 4, null)
        );
        if (rows.affectedRows > 0) {
          //insert data가 최종적으로 1개이상이면...
          UpdateTime('Webdrama_Episodelist', 'List_Playlistid', id);
        }
      }
    });
  });
  return callback(null);
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
        console.log('Video API에서 ' + id + ' 데이터 요청완료...');
      }
    });
  });
};

////////////////////////////
//스케쥴러
////////////////////////////
/*schedule.scheduleJob('0 * * * * *', function () {
  async.waterfall(
    [ChannelUpdate, DramaUpdate, DramaListUpdate],
    (err, result) => {
      if (err) {
        console.log('에러입니다 : ' + err);
      } else {
        console.log('스케쥴러 완료');
      }
    }
  );
});*/

////////////////////////////
//test스케쥴러
////////////////////////////
async.waterfall(
  [ChannelUpdate, DramaUpdate, DramaListUpdate],
  (err, result) => {
    if (err) {
      console.log('에러입니다 : ' + err);
    } else {
      console.log('스케쥴러 완료');
    }
  }
);
