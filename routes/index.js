const express = require('express');
const router = express.Router();
// const { spawn } = require('child_process').spawn;

// mysql connection
const mysqlConnection = require('../config/mysql');
const conn = mysqlConnection.init();
mysqlConnection.open(conn);
// const search = spawn('python', ['search.py']);

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
    `UPDATE Webdrama_Episodelist SET Viewcount = Viewcount + 1 WHERE List_Title LIKE '%` +
    titleName +
    `%';`;
  conn.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.status(204);
    }
  });
});

//역대 인기 조회 수 작품
router.get('/popular/list', (req, res) => {
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
router.get('/popular/weekend/list', (req, res) => {
  //여기서 데이터 가공하시면 됩니다.
  //res.json('할로!!!');
  router.get('/popular/list', (req, res) => {
  
    Date.prototype.getWeek = function(start)
    {
        // 현재 주차의 시작일 (월) 종료일 (일)
        start = start || 0;
        var today = new Date(this.setHours(0, 0, 0, 0));
        var day = today.getDay() - start;
        var date = today.getDate() - day;
     
          
        var StartDate = new Date(today.setDate(date + 1)); // toDay + 1
        var EndDate = new Date(today.setDate(date + 7)); // toDay + 7
        
        return [StartDate, EndDate];
    }
     
    // test code
    var Dates = new Date().getWeek();
    alert(Dates[0].toLocaleDateString() + ' to '+ Dates[1].toLocaleDateString());
  
    //  const videocnt = req.params.id;
    // conn.query(
    //   'SELECT * FROM Webdrama_Episodelist WHERE Viewcountweek =' + videocnt + ';',
    //   function (err, rows, fields){
    //     if(err) {
    //       throw err;
    //     } else {
          
    //     }
    //   },
    //   function week(){
    //     var d = new Date();
    //     var dayOf
    //   }
    // )
    
  });
});

/* router.get('/', function (req, res) {
	let dataToSend = 0;
	const python = spawn('python3', ['search.py']);
	python.stdout.on('data', function (data) {
		console.log(data);
		console.log(data.toString());
		dataToSend = data.toString();
	});
	python.on('close', function (code) {
		res.json(dataToSend);
	});
});*/

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
