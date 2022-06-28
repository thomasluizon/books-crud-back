// const db = require('./db');

const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const books = [
	{
		id: 1,
		name: 'Harry Potter and the Philosopher Stone',
		price: 35,
		quantity: 30,
		gender: 'Drama',
		author_id: 1,
	},
	{
		id: 2,
		name: 'xuize',
		price: 10,
		quantity: 0,
		gender: 'oii',
		author_id: 1,
	},
	{
		id: 3,
		name: 'flavio',
		price: 420,
		quantity: 0,
		gender: 'tchau',
		author_id: 2,
	},
];

const authors = [
	{
		id: 1,
		name: 'J.K. Rowling',
	},
	{
		id: 2,
		name: 'Flavio',
	},
];

app.get('/books', (req, res) => {
	res.json(books);
});

app.get('/authors', (req, res) => {
	res.json(authors);
});

app.post('/authors', (req, res) => {
	obj = req.body;

	if (Object.keys(obj).length > 0) {
		const author = {
			id: authors.length + 1,
			name: obj.name,
		};

		authors.push(author);
		res.status(202).send('Author created successfully');
	} else {
		res.status(400).send('Author not created');
	}
});

app.post('/books', (req, res) => {
	const obj = req.body;

	if (Object.keys(obj).length > 0) {
		const author = authors.filter(author => author.name === obj.author);

		if (author.length === 0) {
			res.status(404).send('Author not found');
			return;
		}

		const authorId = author[0].id;

		const book = {
			id: books.length + 1,
			name: obj.name,
			price: obj.price,
			quantity: obj.quantity || 0,
			gender: obj.gender,
			author_id: authorId,
		};

		books.push(book);

		res.status(202).send('Book created successfully');
		return;
	} else {
		res.status(400).send('Book not created');
		return;
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
