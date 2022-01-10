require('dotenv').config();
const express = require('express');
const app = express();
const port = 3001;
const index = require('./routes/index');
// const query = require('./routes/src/query');
// const mysqlConnection = require('./config/mysql');
// const conn = mysqlConnection.init();

// playlisttest.Data(function (response) {
//   console.log(response);
// });

//Playlist실행
// const nowDate = new Date();
// conn.query(
//   'select channelid, date_time from Wd_channelid;',
//   function (err, rows) {
//     if (err) {
//       console.log(err);
//     } else {
//       for (let idNum = 0; idNum < rows.length; idNum++) {
//         const upDate = new Date(rows[idNum].date_time);
//         if (nowDate.getDate() === upDate.getDate()) {
//           continue;
//         } else {
//           const channelId = rows[idNum].channelid;
//           query.PlayList(undefined, channelId);
//         }
//       }
//     }
//   }
// );

// PlaylistItem실행
/*conn.query(
  'select List_Playlistid from Webdrama_Episodelist',
  function (err, rows) {
    if (err) {
      console.log(err);
    } else {
      let idNum = 0;
      while (idNum < rows.length) {
        const playlistid = rows[idNum].List_Playlistid;
        query.PlayListItem(undefined, playlistid);
        idNum++;
      }
    }
  }
);*/

// Video실행
/*conn.query('select Up_Videoid from Webdrama_Upload', function (err, rows) {
  if (err) {
    console.log(err);
  } else {
    let idNum = 0;
    while (idNum < rows.length) {
      const videoid = rows[idNum].Up_Videoid;
      query.Videofunc(videoid);
      idNum++;
    }
  }
});*/

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

//intellij 테스트 중입니다.
app.use(express.json());

app.use('/', index);

app.listen(port, () => console.log('Server Running. . .'));

module.exports = app;
