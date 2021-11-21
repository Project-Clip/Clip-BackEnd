const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mysqlConnection = require('./config/mysql');
const {request} = require('express');
const {json} = require('body-parser');
const conn = mysqlConnection.init();
const app = express();
const port = 3000;

//연결확인
const connresult = mysqlConnection.open(conn);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./routes/index')(app, conn);

app.listen(port, () => console.log('Server Running. . .'));
