const app = express();

app.get('/', (req, res) => {
	res.send('Hello world!\n');
});

app.get('/users', (req, res) => {
	// console.log(res.json(users));
	return res.json(users);
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
