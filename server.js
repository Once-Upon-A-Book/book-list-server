'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = 'postgres://alicialycan:534@localhost:5432/books_app';
const client = new pg.Client(conString);
client.connect();
client.on('error', err => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/test', (req, res) => {
  client.query(`SELECT * FROM books;`)
    .then(data => {
      res.send(data);
    }).catch(err => {
      console.err(err);
    });
  //res.send();
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));