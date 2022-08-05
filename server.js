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
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

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
      res.json(objData)
    }
  })
})

// Post data up to database using api notes url 
app.post('/api/notes', (req, res) => {

  // storing user's title and text data 
  const title = req.body.title;
  const text = req.body.text;

  // sending back a status 200 
  res.status(200).send({ title, text })

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

      // pushing user's new note into variable database 
      notesObj.push(newNote)

      fs.writeFile('./db/db.json', JSON.stringify(notesObj), err => { err ? console.log(err) : console.log('Database Updated!') })
    }
  })
})

// delete method for api to notes url 
app.delete('/api/notes/:id', (req, res) => {
  let id = req.params.id

  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      const dataBase = JSON.parse(data);

      // loop through database to match IDs to delete 
      for (i = 0; i < dataBase.length; i++) {
        if (dataBase[i].id === id) {
          dataBase.splice(i, 1);

        // Update the database with deleted note
        fs.writeFile('./db/db.json', JSON.stringify(dataBase), err => {
          if (err) {
            console.log(err)
          } else {
            console.log('Deleted Note in Database!')
            return res.send("Deleted!");
          }
        })
        }
      }
    }
  })
})

// Checks if the user goes to a different URL to redirect them to the index.html 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// listening to port when server starts 
app.listen(PORT, () => console.log(`Listening on PORT http://localhost:${PORT} 🐸`))