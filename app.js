require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const index = require('./routes/index');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.json());

app.use('/', index);

app.listen(port, () => console.log('Server Running. . .'));

module.exports = app;
