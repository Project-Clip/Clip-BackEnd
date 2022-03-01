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
  const data = [];
  let hasDate;
  conn.query(
    'select id, channelid, List_Lastupdate from Wd_channelid;',
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log('(ChannleUpdate)현재 일입니다. : ' + nowDate.getDate());
        for (let num = 0; num < rows.length; num++) {
          const channelId = rows[num].channelid;
          hasDate = new Date(rows[num].List_Lastupdate);
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
            data.push(channelId);
            UpdateTime('Wd_channelid', 'channelid', channelId);
          }
        }
        console.log('ChannelUpdate' + data);
        return callback(null, data, nowDate);
      }
    }
  );
};

//웹드라마 업데이트
DramaUpdate = (nowDate, callback) => {
  const idList = [];
  conn.query(
    'select List_Playlistid, List_Lastupdate from Webdrama_Episodelist;',
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log('(DramaUpdate)현재 일입니다. : ' + nowDate.getDate());
        for (let num = 0; num < rows.length; num++) {
          const dramaId = rows[num].List_Playlistid; //List_Playlistid
          const hasDate = new Date(rows[num].List_Lastupdate);
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
            idList.push(dramaId);
          }
        }
        return callback(null, idList, nowDate);
      }
    }
  );
};

//유튜브에서 추출한 Video id query
PlayListItemQuery = (nowDate, callback) => {
  // const sql = `select GROUP_CONCAT(Up_Videoid SEPARATOR '') from Webdrama_Upload;`;
  const sql = `select Up_Videoid from Webdrama_Upload;`;
  conn.query(sql, function (err, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log('테스트중입니다. : ' + JSON.stringify(rows[0], null, 2));
      const pakageData = [];
      for (let num = 0; num < rows.length; num++) {
        pakageData.push(rows[num].Up_Videoid);
      }
      console.log('테스트중입니다2. : ' + pakageData);
      return callback(null, pakageData);
    }
  });
};

//데이터 비교 후, 모자라 데이터 있으면 다시 채우기
VideoFuncQuery = (data, callback) => {
  // const sql = `select GROUP_CONCAT(Videoid SEPARATOR ',') from Episode_Video;`;
  const sql = `select Videoid from Episode_Video;`;
  conn.query(sql, function (err, rows) {
    if (err) {
      console.log(err);
    } else {
      const gemstone = [];
      for (let num = 0; num < rows.length; num++) {
        gemstone.push(rows[num].Videoid);
      }
      console.log('테스트중입니다3. : ' + JSON.stringify(gemstone, null, 2));
      const searchData = data.filter((item, index) => {
        console.log(gemstone.indexOf(item));
        return gemstone.indexOf(item) === -1;
      }); //중복되지 않은 값만 불러오기
      console.log('검색해야할 데이터 : ' + searchData);
      return callback(null, searchData);
    }
  });
};

//일주일 단위로 주간 인기작품 카운트 수 초기화
InitializationOfPopularity = (callback) => {
  const sql = `UPDATE Webdrama_Episodelist SET Viewcountweek = 0`;
  conn.query(sql, function (err, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log('인기작품 리스트 초기화 완료' + rows);
    }
    return callback(null);
  });
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
        '(UpdateTime)업데이트 완료...' + JSON.stringify(rows, null, 4)
      );
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
PlayList = (id, nowDate, callback) => {
  for (let num = 0; num < id.length; num++) {
    Playlist.Data(undefined, id[num], (response) => {
      const sql =
        'INSERT IGNORE INTO Webdrama_Episodelist(List_Playlistid, List_Title, List_Description, List_PublishedAt, List_Channelid, List_ChannelTitle, List_Thumnails) VALUES ?;'; // 컬럼은 따로 변경 부탁드립니다.
      conn.query(sql, [response], (err, rows, fields) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Playlist API에서 ' + id[num] + ' 데이터 요청완료...');
        }
      });
    });
  }
  return callback(null, nowDate);
};

// playlistItem Module을 사용하는 함수입니다.
PlayListItem = (id, nowDate, callback) => {
  for (let num = 0; num < id.length; num++) {
    PlaylistItem.Data(undefined, id[num], (response) => {
      const sql =
        'INSERT IGNORE INTO Webdrama_Upload(Up_Playlistid, Up_Channelid, Up_Videoid) VALUES?;'; // 컬럼은 따로 변경 부탁드립니다.
      conn.query(sql, [response], function (err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            'PlaylistItem API에서 ' + id[num] + ' 데이터 요청완료...'
          );
          console.log(
            'PlaylistItem에서 Insert된 데이터 : ' +
              JSON.stringify(rows.affectedRows, 2, null)
          );
          if (rows.affectedRows > 0) {
            //insert data가 최종적으로 1개이상이면...
            UpdateTime('Webdrama_Episodelist', 'List_Playlistid', id[[num]]);
          }
        }
      });
    });
  }
  return callback(null, nowDate);
};

// Video Module을 사용하는 함수입니다.
Videofunc = (id, callback) => {
  console.log('Video : ' + id);
  for (let num = 0; num < id.length; num++) {
    Video.Data(id[num], (response) => {
      const sql =
        'INSERT IGNORE INTO Episode_Video(Videoid, Title, Description, ChannelId, Like_Count) VALUES?;';
      conn.query(sql, [response], function (err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log('Video API에서 ' + id[num] + ' 데이터 요청완료...');
        }
      });
    });
  }
  return callback(null);
};

////////////////////////////
//스케쥴러
////////////////////////////
schedule.scheduleJob('0 0 21 * * *', function () {
  async.waterfall(
    [
      ChannelUpdate,
      PlayList,
      DramaUpdate,
      PlayListItem,
      PlayListItemQuery,
      VideoFuncQuery,
      Videofunc,
    ],
    (err, result) => {
      if (err) {
        console.log('에러입니다 : ' + err);
      } else {
        console.log('새로고침 완료 . . .');
      }
    }
  );
});

schedule.scheduleJob('0 0 0 * * 1', function () {
  async.series([InitializationOfPopularity], (err, result) => {
    if (err) {
      console.log('에러입니다.' + err);
    } else {
      console.log('스케쥴러 완료');
    }
  });
});

////////////////////////////
//test스케쥴러
////////////////////////////
/*async.waterfall(
  [ChannelUpdate, DramaUpdate, DramaListUpdate],
  (err, result) => {
    if (err) {
      console.log('에러입니다 : ' + err);
    } else {
      console.log('스케쥴러 완료');
    }
  }
);*/

//드라마 목록 새로고침 스케쥴러
/*async.waterfall(
  [
    ChannelUpdate,
    PlayList,
    DramaUpdate,
    PlayListItem,
    PlayListItemQuery,
    VideoFuncQuery,
    Videofunc,
  ],
  (err, result) => {
    if (err) {
      console.log('에러입니다 : ' + err);
    } else {
      console.log('스케쥴러 완료');
    }
  }
);*/

//주간 인기도 초기화 스케쥴러
/*async.series([InitializationOfPopularity], (err, result) => {
  if (err) {
    console.log('에러입니다.' + err);
  } else {
    console.log('스케쥴러 완료');
  }
});*/
