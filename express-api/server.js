const express = require('express');
const dotENV = require('dotenv').config();

const app = express();
const port = process.env.POSTGRES_PORT || 3256;

app.get('/', function (req, res) {
  return res.send('Hello world');
 });

app.listen(port)