var mysql = require('mysql');

var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
	database: 'dramas'
});

/* Send query to database. Received data will be printed in JSON Format */
var sampleQuery = 'SELECT * FROM test1';

con.query(sampleQuery, function(err, results, fields) {
	if(err) {
		console.log('Unable to process requested query.');
		throw err;
	} else {
		console.log('SUCCESS! Query has been processed.');
		console.log(JSON.parse(JSON.stringify(results)));
	}
});
