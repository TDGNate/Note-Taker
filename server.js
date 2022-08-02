const express = require('express');
const app = express();
const path = require('path')
const db = require('./db/db.json');
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'))
// })