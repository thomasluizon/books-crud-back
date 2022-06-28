require('dotenv').config();

async function connect() {
	if (global.connection && global.connection.state !== 'disconnected')
		return global.connection;

	const mysql = require('mysql2/promise');

	const connection = await mysql.createConnection(
		`mysql://root:${process.env.db_password}@localhost:3306/bookscrud`
	);

	console.log('DB connected');
	global.connection = connection;

	return connection;
}

async function selectBooks() {
	const connection = await connect();
	const books = connection.query('SELECT * FROM books;');
	return await books;
}

module.exports = { selectBooks };
