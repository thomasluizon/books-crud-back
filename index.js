import {
	createInitialTables,
	selectBooks,
	selectAuthors,
	addBook,
	addAuthor,
	updateBook,
	updateAuthor,
	selectSpecificBook,
	selectSpecificAuthor,
	deleteBook,
	deleteAuthor,
} from './db.js';

import express from 'express';
import cors from 'cors';
const app = express();

createInitialTables();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Working!');
});

// Get books
app.get('/books', async (req, res) => {
	const books = await selectBooks();
	res.json(books);
});

// Get specific book

app.get('/books/:id', async (req, res) => {
	const book = await selectSpecificBook(req.params.id);

	if (book === 'Book not found') {
		res.status(404).send(book);
		return;
	}

	res.json(book);
});

// Get authors
app.get('/authors', async (req, res) => {
	const authors = await selectAuthors();
	res.json(authors);
});

// Get specific author
app.get('/authors/:id', async (req, res) => {
	const author = await selectSpecificAuthor(req.params.id);

	if (author === 'Author not found') {
		res.status(404).send(author);
		return;
	}

	res.json(author);
});

// Add book
app.post('/books', async (req, res) => {
	const obj = req.body;

	if (Object.keys(obj).length > 0) {
		const response = await addBook(obj);
		const status = response === 'Book created successfully' ? 202 : 400;
		res.status(status).send(response);
		return;
	}
});

// Add author
app.post('/authors', async (req, res) => {
	const obj = req.body;

	const response = await addAuthor(obj);
	const status = response === 'Author created successfully' ? 202 : 400;
	res.status(status).send(response);
});

// Update book
app.put('/books/:id', async (req, res) => {
	const obj = req.body;
	const book = await updateBook(obj, parseInt(req.params.id));

	const status =
		book === 'Book updated successfully'
			? 200
			: book === 'Author not found' || book === 'Book not found'
			? 404
			: 400;

	res.status(status);
	res.send(book);
});

// Update author

app.put('/authors/:id', async (req, res) => {
	const obj = req.body;

	const author = await updateAuthor(obj, parseInt(req.params.id));

	const status =
		author === 'Author updated successfully'
			? 200
			: author === 'Author not found'
			? 404
			: 400;

	res.status(status);
	res.send(author);
});

// Delete book

app.delete('/books/:id', async (req, res) => {
	const response = await deleteBook(parseInt(req.params.id));

	const status =
		response === 'Book deleted successfully'
			? 200
			: response === 'Book not found'
			? 404
			: 400;

	res.status(status);
	res.send(response);
});

// Delete author

app.delete('/authors/:id', async (req, res) => {
	const response = await deleteAuthor(parseInt(req.params.id));

	const status =
		response === 'Author deleted successfully'
			? 200
			: response === 'Author not found'
			? 404
			: 400;

	res.status(status);
	res.send(response);
});

// Server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
