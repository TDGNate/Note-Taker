// Importing Express 
const express = require('express');
const app = express();

// Importing Path for URL 
const path = require('path');
const db = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const uniqid = require('uniqid'); 

// Middleware 
app.use(express.json())
app.use(express.static('public'))

// Get method when the url is to the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// Get method when the url is to /notes 
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// Get method when the url is to api and notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
    } else {

      // change Data into an Obj 
      const objData = JSON.parse(data)
      console.log(objData)
      res.json(objData)
    }
  })
})

// Post data up to database using api notes url 
app.post('/api/notes', (req, res) => {

  // storing user's title and text data 
  const title = req.body.title;
  const text = req.body.text;

  res.send(200, { title, text })

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {

      // Switch data type to object 
      const notesObj = JSON.parse(data);
      const newNote = {
        title,
        text,
        id: uniqid()
      }
      notesObj.push(newNote)
      console.log(`It has been written! \n ${notesObj}`)

      fs.writeFile('./db/db.json', JSON.stringify(notesObj), err => { err ? console.log(err) : console.log('Database Updated!') })
    }
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(PORT, () => console.log(`Listening on PORT http://localhost:${PORT} 🐸`))