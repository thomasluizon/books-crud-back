import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

async function connect() {
	if (global.connection && global.connection.state !== 'disconnected')
		return global.connection;

	const connection = await mysql.createConnection(
		`mysql://root:${process.env.db_password}@localhost:3306/bookscrud`
	);

	console.log('DB connected');
	global.connection = connection;

	return connection;
}

export async function selectBooks() {
	const connection = await connect();
	const books = await connection.query('SELECT * FROM books;');
	return await books[0];
}

export async function addBook(book) {
	const connection = await connect();

	const authorQuery = await connection.query(
		'SELECT authors.id FROM authors WHERE name = ?',
		book.authorName
	);

	const author_id = authorQuery[0][0]?.id;
	if (!author_id) return 'Author not found';

	const sql =
		'INSERT INTO books (name, price, quantity, gender, author_id) VALUES (?, ?, ?, ?, ?);';
	const values = [
		book.name,
		book.price,
		book.quantity || 0,
		book.gender,
		author_id,
	];

	try {
		await connection.query(sql, values);
		return 'Book created successfully';
	} catch (err) {
		return err.message;
	}
}
