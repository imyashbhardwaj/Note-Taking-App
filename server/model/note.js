const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const NoteSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  authorId:{
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
});

const NoteModel = mongoose.model("note", NoteSchema);

module.exports = NoteModel;
