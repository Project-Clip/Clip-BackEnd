const express = require('express');
const app = express();
const path = require('path');

const searchScript = path.resolve('routes', 'src', 'search.py');
console.log(`파일경로입니다 : ${searchScript}`);
app.get('/', (req, res) => {
	const {spawn} = require('child_process');
	const search = spawn('python3', [searchScript]);

	search.stdout.on('data', function (data) {
		console.log('파이썬 파일에서 반환받은 성분입니다. : ' + data.toString());
		res.json(data.toString());
	});
});

app.listen(4000, () => console.log('Application listening on port 4000!'));
