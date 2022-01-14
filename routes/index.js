const express = require('express');
const router = express.Router();
// const { spawn } = require('child_process').spawn;

// mysql connection
const mysqlConnection = require('../config/mysql');
const conn = mysqlConnection.init();
mysqlConnection.open(conn);
// const search = spawn('python', ['search.py']);

// GET Method API
router.get('/', (req, res) => {
  console.log('현재 /를 요청중입니다.');
  res.send('연결성공!!');
});

//검색 기능
router.get('/search', (req, res) => {
  const titleName = decodeURIComponent(req.query.title);
  const sql =
    `SELECT * FROM Webdrama_Episodelist WHERE List_Title LIKE '%` +
    titleName +
    `%';`;
  conn.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.json(rows);
    }
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
    conn.query('SELECT * FROM ' + table + ';', function (err, rows, fields) {
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
    conn.query(
      'SELECT * FROM Webdrama_Episodelist WHERE List_id =' + dramaId + ';',
      function (err, rows, fields) {
        if (err) {
          throw err;
        } else {
          console.log('GET Method 정상작동.' + JSON.stringify(rows, null, 4));
          res.render(rows);
        }
      }
    );
  }
});

router.get('/popular/list', (req, res) => {
  //여기서 데이터 가공하시면 됩니다.
  res.json('할로!!!');
});

module.exports = router;
