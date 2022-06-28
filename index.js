import { selectBooks, addBook } from './db.js';
import express from 'express';

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/books', async (req, res) => {
	const books = await selectBooks();
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

app.post('/books', async (req, res) => {
	const obj = req.body;

	if (Object.keys(obj).length > 0) {
		const response = await addBook(obj);
		const status = response === 'Book created successfully' ? 200 : 400;
		res.status(status).send(response);
		return;
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
