// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
// 	const {spawn} = require('child_process');
// 	let pyProg = spawn('python3', ['search.py']);

// 	pyProg.stdout.on('data', function (data) {
// 		console.log('파이썬 파일에서 반환받은 성분입니다. : ' + data.toString());
// 		res.json(data.toString());
// 	});
// });

// app.listen(4000, () => console.log('Application listening on port 4000!'));
const express = require('express');
const app = express();
const path = require('path');

var drc = path.resolve('search.py');
console.log(`파일경로입니다 : ${drc}`);
app.get('/', (req, res) => {
	const {spawn} = require('child_process');
	let search = spawn('python3', ['./routes/src/search.py']);

	search.stdout.on('data', function (data) {
		console.log('파이썬 파일에서 반환받은 성분입니다. : ' + data.toString());
		res.json(data.toString());
	});
});

app.listen(4000, () => console.log('Application listening on port 4000!'));
