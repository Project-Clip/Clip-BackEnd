require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const index = require('./routes/index');
require('./routes/src/playlist');
require('./routes/src/playlistItem');
require('./routes/src/video');
let playlisttest = require('./routes/src/playlisttest'); //.gitignore된 파일입니다 삭제하시면 됩니다.

playlisttest.Data(function (response) {
	console.log(response);
});

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.json());

app.use('/', index);

app.listen(port, () => console.log('Server Running. . .'));

module.exports = app;
