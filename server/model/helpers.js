const NoteModel = require("./note");

function createANewNote(noteDetails) {
  try {
    return NoteModel.create(noteDetails);
  } catch (error) {
    throw new Error(`Some Error while creating a new note ${error}`);
  }
}

function getAllNotesForGivenQuery(searchQuery) {
  try {
    return NoteModel.find(searchQuery);
  } catch (error) {
    throw new Error(`Some Error while retrieving notes ${error}`);
  }
}

function getFirstNoteForGivenQuery(searchQuery) {
  try {
    return NoteModel.find(searchQuery).limit(1);
  } catch (error) {
    throw new Error(`Some Error while retrieving the note ${error}`);
  }
}

async function updateANoteWithGivenId(id, updatedProps) {
  try {
    const filter = { id };
    const update = { $set: updatedProps };
	  console.log("saving Note", updatedProps)
    await NoteModel.updateOne(filter, update);
  } catch (error) {
    throw new Error(`Some Error while updating the note ${error}`);
  }
}

module.exports = {
  createANewNote,
  getAllNotesForGivenQuery,
  getFirstNoteForGivenQuery,
  updateANoteWithGivenId
};
