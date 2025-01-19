const express = require("express");
const router = express.Router();
const dbHelpers = require("../../model/helpers");

router.get("/getNotes", (req, res) => {
  const authorId = req.query.authorId;
  dbHelpers
    .getAllNotesForGivenQuery(authorId)
    .then((notes) => res.json(notes))
    .catch((error) => res.json(error));
});

router.get("/getNote", (req, res) => {
  const noteId = req.query.id;
  const searchQuery = { id: noteId };
  dbHelpers
    .getFirstNoteForGivenQuery(searchQuery)
    .then((note) => res.json(note))
    .catch((error) => res.json(error));
});

module.exports = router;
