const { updateANoteWithGivenId } = require("../model/helpers");

const notesState = {};

const dbStateDeleteTimeoutInMilliSeconds = 5000;
const dbStateUpdateTimeoutInMilliSeconds = 1000;
async function saveAllNotesState() {
  Object.entries(notesState).forEach(async ([id, noteProps]) => {
    if (!noteProps.isUpdatedInDb) {
      const { title, content } = noteProps;
      const updatedNoteProps = {
        ...(title !== undefined && { title }),
        ...(content != undefined && { content }),
      };
      await updateANoteWithGivenId(id, updatedNoteProps);
      noteProps.isUpdatedInDb = true;
    }
  });
}

function clearSavedNotesData() {
  for (const noteId in notesState) {
    if (notesState[noteId].isUpdatedInDb) {
      delete notesState[noteId];
    }
  }
}

function handleNotePropUpdate(updateMsg, socket, property) {
  const { updatedValue, noteId } = updateMsg;
  socket.join(noteId);
  notesState[noteId] ??= {};
  notesState[noteId][property] = updatedValue;
  notesState[noteId].isUpdatedInDb = false;
}

function handleNoteTitleNameUpdate(updateMsg, socket) {
  handleNotePropUpdate(updateMsg, socket, 'title');
}

function handleNoteContentNameUpdate(updateMsg, socket) {
  handleNotePropUpdate(updateMsg, socket, 'content');
}

function getNotesStateForNoteId(noteId) {
  return notesState[noteId] ?? {};
}

function getNotesState() {
  return JSON.parse(JSON.stringify(notesState));
}

module.exports = {
  saveAllNotesState,
  handleNoteTitleNameUpdate,
  handleNoteContentNameUpdate,
  getNotesStateForNoteId,
  getNotesState,
};

setInterval(saveAllNotesState, dbStateUpdateTimeoutInMilliSeconds);
setInterval(clearSavedNotesData, dbStateDeleteTimeoutInMilliSeconds);

