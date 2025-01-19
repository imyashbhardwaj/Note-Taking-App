const express = require("express");
const router = express.Router();
const dbHelpers = require("../../model/helpers");

router.post("/create", (req, res) => {
  dbHelpers
    .createANewNote(req.body)
    .then((employees) => res.json(employees))
    .catch((err) => res.json(err));
});

module.exports = router;
