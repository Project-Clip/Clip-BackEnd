//var sql = 'INSERT INTO webdrama(Field 명들) VALUES(테이블에 넣을 값 이걸 파일로해서 넣어야하는데 문제)';
var mysql = require('mysql');
var test = require('./Video.js');


  var con = mysql.createConnection({
          host: "127.0.0.1",
          user: "root",
          password: "111111",
          database : "webdrama",
          charset : 'utf8mb4'
  });

  con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
  });



test.AngryDoyoon(function (response) {
  let data = response.snippet;
  let likecount = response.statistics;
  var sql = 'INSERT INTO episode_video(title, description, channelId, likeCount) VALUES(?,?,?,?)'
  var params = [];
  let a = params.push(data.title);
  let b = params.push(data.description);
  let s = params.push(data.channelId);
  let c = params.push(likecount.likeCount);
    console.log(params);

  con.query(sql, params,function(err, rows, fields){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  })
});
