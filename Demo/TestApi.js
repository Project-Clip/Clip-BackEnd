const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('Hello world!\n');
});

app.get('/users', (req, res) => {
	// console.log(res.json(users));
	res.send(users);
});

app.get('/users/:id', (req, res) => {
	// /users/id값을 받으면 입력 받은 값을 반환.
	console.log(req.params.id); //받은 id값을 확인
	const id = parseInt(req.params.id, 10); //id 값을 변수로 선언
	if (id == 1) {
		//반복문으로 리팩토링 가능
		//id가 ~~일 경우
		res.send(users[0]);
	} else if (id == 2) {
		res.send(users[1]);
	} else if (id == 3) {
		res.send(users[2]);
	} else if (id == 4) {
		res.send(users[3]);
	} else if (id == 5) {
		res.send(users[4]);
	} else {
		res.send('Data를 찾을 수 없습니다.');
	}
});

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});

let users = [
	{
		id: 1,
		name: 'yunsu',
	},
	{
		id: 2,
		name: 'yunsu22',
	},
	{
		id: 3,
		name: 'yunsu33',
	},
	{
		id: 4,
		name: 'yunsu44',
	},
	{
		id: 5,
		name: 'yunsu55',
	},
];

/*var returnResult = function (err, res) {
	// 결과를 눈으로 보기 쉽게하기 위해 result 객체 생성
	var result = {};
	if (err) {
		res.status(400);
		result.message = err.stack;
	} else {
		res.status(200);
		result.message = 'Success';
	}
	return result;
};*/
