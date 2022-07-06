import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

async function connect() {
	if (global.connection && global.connection.state !== 'disconnected')
		return global.connection;

	const host = process.env.MYSQL_HOST || 'localhost';
	const user = process.env.MYSQL_USER || 'root';
	const password = process.env.MYSQL_PASS || process.env.db_password;
	const port = process.env.MYSQL_PORT || '3306';
	const database = process.env.MYSQL_DB || 'bookscrud';

	const connection = await mysql.createConnection({
		host,
		user,
		password,
		port,
		database,
	});

	console.log('DB connected');
	global.connection = connection;

	return connection;
}

export async function createInitialTables() {
	const connection = await connect();
	await connection.query(`
		CREATE TABLE IF NOT EXISTS authors (
			id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
				name VARCHAR(100) NOT NULL
		);
	`);

	await connection.query(`
		CREATE TABLE IF NOT EXISTS books (
			id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		name VARCHAR(100) NOT NULL,
			price FLOAT NOT NULL,
			quantity INT NOT NULL,
			gender VARCHAR(100) NOT NULL,
			author_id INT NOT NULL,
			FOREIGN KEY (author_id) REFERENCES authors(id)
	);
	`);
}

async function getAuthorId(connection, name) {
	const authorQuery = await connection.query(
		'SELECT authors.id FROM authors WHERE name = ?',
		name
	);

	const author_id = authorQuery[0][0]?.id;
	return author_id;
}

// CREATE
export async function addBook(book) {
	const connection = await connect();

	const author_id = await getAuthorId(connection, book.authorName);

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

export async function addAuthor(author) {
	const connection = await connect();
	const sql = 'INSERT INTO authors (name) VALUES (?);';

	if (!author.name) return 'Author not provided';

	try {
		connection.query(sql, author.name);
		return 'Author created successfully';
	} catch (err) {
		return err.message;
	}
}

// READ
export async function selectBooks() {
	const connection = await connect();
	const books = await connection.query(
		'SELECT books.*, authors.name AS authorName FROM books JOIN authors ON books.author_id = authors.id;'
	);
	return await books[0];
}

export async function selectSpecificBook(id) {
	const connection = await connect();
	const sql =
		'SELECT books.*, authors.name AS authorName FROM books JOIN authors ON books.author_id = authors.id WHERE books.id = ?';

	const query = await connection.query(sql, id);

	if (query[0].length !== 0) {
		const book = query[0][0];
		return book;
	}

	return 'Book not found';
}

export async function selectAuthors() {
	const connection = await connect();
	const authors = await connection.query('SELECT * FROM authors;');
	return await authors[0];
}

export async function selectSpecificAuthor(id) {
	const connection = await connect();
	const sql = 'SELECT * FROM authors WHERE id = ?';

	const query = await connection.query(sql, id);

	if (query[0].length !== 0) {
		const author = query[0][0];
		return author;
	}

	return 'Author not found';
}

// UPDATE
export async function updateBook(book, id) {
	const connection = await connect();

	const author_id = await getAuthorId(connection, book.authorName);
	if (!author_id) return 'Author not found';

	const sql =
		'UPDATE books SET name=?, price=?, quantity=?, gender=?, author_id=? WHERE id=?';
	const values = [
		book.name,
		book.price,
		book.quantity,
		book.gender,
		author_id,
		id,
	];

	try {
		const query = await connection.query(sql, values);
		if (query[0].changedRows === 0) return 'Book not found';
		return 'Book updated successfully';
	} catch (err) {
		return err.message;
	}
}

export async function updateAuthor(author, id) {
	const connection = await connect();

	const sql = 'UPDATE authors SET name=? WHERE id=?';
	const values = [author.name, id];

	try {
		const query = await connection.query(sql, values);
		if (query[0].changedRows === 0) return 'Author not found';
		return 'Author updated successfully';
	} catch (err) {
		return err.message;
	}
}

// DELETE

export async function deleteBook(id) {
	const connection = await connect();

	const sql = 'DELETE FROM books WHERE id=?';
	try {
		const query = await connection.query(sql, id);
		if (query[0].affectedRows === 0) return 'Book not found';
		return 'Book deleted successfully';
	} catch (err) {
		return err.message;
	}
}

export async function deleteAuthor(id) {
	const connection = await connect();

	const sql = 'DELETE FROM authors WHERE id=?';

	try {
		const query = await connection.query(sql, id);
		if (query[0].affectedRows === 0) return 'Author not found';
		return 'Author deleted successfully';
	} catch (err) {
		return err.message;
	}
}
