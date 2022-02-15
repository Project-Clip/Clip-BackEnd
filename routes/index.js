const express = require('express');
const router = express.Router();

// mysql connection
const mysqlConnection = require('../config/mysql');
// const async = require('async');
const conn = mysqlConnection.init();
mysqlConnection.open(conn);

//함수
GetQuery = (sql) => {
  conn.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      return rows;
    }
  });
};

// GET Method API
router.get('/', (req, res) => {
  console.log('현재 /를 요청중입니다.');
  res.send('연결성공!!');
});

//검색 기능
router.get('/search/dramatitle', (req, res) => {
  const titleName = decodeURIComponent(req.query.List_Title);
  const sql =
    `SELECT * FROM Webdrama_Episodelist WHERE List_Title LIKE '%` +
    titleName +
    `%';`;
  conn.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.status(201).json(rows);
    }
  });
});

//조회수 카운트
router.put('/plusview', (req, res) => {
  const titleName = decodeURIComponent(req.query.List_Title);
  const sql =
    `UPDATE Webdrama_Episodelist SET Viewcount = Viewcount + 1, Viewcountweek = Viewcountweek + 1 WHERE List_Title LIKE '%` +
    titleName +
    `%';`;
  conn.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.status(204).json(rows);
    }
  });
});

//역대 인기 조회 수 작품
router.get('/popular/dramalist', (req, res) => {
  //여기서 데이터 가공하시면 됩니다.
  const sql = `SELECT List_Playlistid,List_Title,List_Thumnails FROM Webdrama_Episodelist;`;
  conn.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      const popularList = rows;
      popularList.sort(function (a, b) {
        return a.Viewcount - b.Viewcount;
      });
      popularList.reverse();
      res.status(206).json(popularList);
    }
  });
});

//주간 인기 조회 수 작품
// router.get('/popular/weekend/list', (req, res) => {
//   Date.prototype.getWeek = function (start) {
//     // 현재 주차의 시작일 (월) 종료일 (일)
//     start = start || 0;
//     const today = new Date(this.setHours(0, 0, 0, 0));
//     const day = today.getDay() - start;
//     const date = today.getDate() - day;
//
//     const StartDate = new Date(today.setDate(date + 1)); // toDay + 1
//     const EndDate = new Date(today.setDate(date + 7)); // toDay + 7
//
//     return [StartDate, EndDate];
//   };
// });

router.get('/today/dramalist', (req, res) => {
  const nowDate = new Date();
  let hasDate;
  const sql =
    'select List_Playlistid, List_Lastupdate from Webdrama_Episodelist;';
  conn.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      for (let idNum = 0; idNum < rows.length; idNum++) {
        const dramaId = rows[idNum].List_Playlistid; //List_Playlistid
        hasDate = new Date(rows[idNum].List_Lastupdate);
        hasDate.setHours(hasDate.getHours() + 9);
        // hasDate.setHours(hasDate.getHours() - 24); //test code);
        if (
          nowDate.getFullYear() === hasDate.getFullYear() &&
          nowDate.getMonth() === hasDate.getMonth() &&
          nowDate.getDate() === hasDate.getDate()
        ) {
          //현재 시간과 업뎃 시간이 같다면?
          continue;
        } else {
          /*여기서 고민인 것이 배열을 하나 만들어서 조건에 맞는 data push후, json으로 전송을 할 것인지,
           * 아니면 rows에서 splice해서 json으로 전송할 것인지 고민중. 앵간해서는 후자로 하고 싶음.*/
        }
      }
    }
  });
});

//test API
router.get('/:tables', (req, res) => {
  const table = req.params.tables;
  if (table === undefined) {
    res.send('tables 입력바람');
  } else if (
    table === 'Webdrama_Episodelist' ||
    'Webdrama_Upload' ||
    'Episode_Video'
  ) {
    const sql = 'SELECT * FROM ' + table + ';';
    conn.query(sql, function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        console.log('GET Method 정상작동.' + JSON.stringify(rows, null, 4));
        res.json(rows);
      }
    });
  } else {
    res.send('유효한 table이 아닙니다.');
  }
});

router.get('/webdrama/:id', (req, res) => {
  if (id === undefined) {
    res.send('ID 입력바람');
  } else {
    const dramaId = req.params.id;
    const sql =
      'SELECT * FROM Webdrama_Episodelist WHERE List_id =' + dramaId + ';';
    conn.query(sql, function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        console.log('GET Method 정상작동.' + JSON.stringify(rows, null, 4));
        res.render(rows);
      }
    });
  }
});

module.exports = router;
