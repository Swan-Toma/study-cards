/*
 *  Connect to MySQL database.
 */


const mysql = require('mysql');
const DatabaseConfig = require('./config/database-config');


// Retrieve MySQL connection
const getConnection = new Promise((resolve, reject) => {
	const con = mysql.createConnection({
		host: DatabaseConfig.host,
		user: DatabaseConfig.user,
		password: DatabaseConfig.password,
		database: DatabaseConfig.database
	});

	con.connect((err) => {
		if (err) {
			reject("Error: " + err.message);
		} else {
			console.log("Database connected! Listening on port " + con.config.port + "...")
			resolve(con);
		}
	});
});


// Terminate MySQL connection
function closeConnection(con) {
	con.end((err) => {
		if (err) {
			console.log("Error: " + err.message);
			return null;
		}
		console.log("Connection closed on port " + con.config.port);
	});
}


const retreiveAllCards = new Promise((resolve, reject) => {
	getConnection.then((con) => {
		con.query('SELECT * FROM card', (err, rows) => {
			if (err) {
				reject("Query result failed for retrieving all cards.");
			}
			resolve(rows);
		});
		closeConnection(con);
	}, (error) => {
		reject("Database connection error.");
	});
});


// Expose function(s)
module.exports.retreiveAllCards = retreiveAllCards;