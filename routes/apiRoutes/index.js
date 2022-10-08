const router = require('express').Router();
const { notes } = require('../../db/db.json');
const uuid = require('uuid');
const fs = require("fs");
const path = require('path');
const { route } = require('express/lib/application');

router.get('/notes', (req, res) => {
  const notes = fs.readFileSync(path.join(__dirname, '../../db/db.json'), 'utf8');
   res.json(JSON.parse(notes));
 });

// POST request to add a note
router.post('/notes', (req, res) => {
  
  const { title, text } = req.body;

  if (title && text) {

    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

router.delete('/notes/:id', (req, res) => {
  const id = req.params.id
  const notes = fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data)
    console.log(notes, id)
    fs.writeFile('db/db.json', JSON.stringify(notes.filter((note) => note.id !== id)), (err) => {
      if (err) throw err;
    })
    res.json({
      ok: true
    })
  }) 
});

module.exports = router;