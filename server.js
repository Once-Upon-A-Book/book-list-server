'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://alicialycan:534@localhost:5432/books_app';
//const DATABASE_URL = process.env.DATABASE_URL || 'postgres://amgranad:amber123@localhost:5432/books_app';
//const TOKEN = process.env.TOKEN || 54321;

const client = new pg.Client(DATABASE_URL);
client.connect();

client.on('error', err => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url FROM books;`)
    .then(result => {
      res.send(result.rows);
    }).catch(err => {
      console.err(err);
    });
});

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`
    SELECT * FROM books WHERE book_id=$1;
  `, [req.params.id]
  ).then(result => res.send(result.rows[0]))
    .catch(err => console.error(err));
});

app.post('/api/v1/books', (req, res) => {
  client.query(`
    INSERT INTO books (title, author, image_url, isbn, description)
    VALUES($1, $2, $3, $4, $5);
  `,
    [
      req.body.title,
      req.body.author,
      req.body.image_url,
      req.body.isbn,
      req.body.description
    ]
  ).then(() => res.send('inserted successfully'))
    .catch(err => console.error(err));
});

app.delete('/api/v1/books/:id', (req, res) => {
  client.query(`
  DELETE FROM books WHERE book_id=$1;  
  `,
    [req.params.id]
  ).then(result => res.send(result))
    .catch(err => console.error(err));
});

app.put('/api/v1/books/:id', (req, res) => {
  console.log('hit books/id with method put()', req.body);
  client.query(`
  UPDATE books 
  SET title='${req.body.title}', author='${req.body.author}', image_url='${req.body.image_url}', isbn='${req.body.isbn}', description='${req.body.description}' 
  WHERE book_id=${req.body.book_id};
  `
  ).then(result => res.status(204).send(result))
    .catch(err => console.error(err));
});

//app.get('/api/v1/admin', (req, res) => res.send(TOKEN === parseInt(req.query.token)));

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));