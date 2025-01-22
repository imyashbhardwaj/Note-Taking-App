const { updateANoteWithGivenId } = require("../model/helpers");

const notesState = {};
const lastSyncedNotesState = {};

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

function updateNoteDetailsInObject(
  updateMsg,
  noteObject,
  { property, skipDbProp = false }
) {
  const { updatedValue, noteId } = updateMsg;
  noteObject[noteId] ??= {};
  noteObject[noteId][property] = updatedValue;
  if (!skipDbProp) noteObject[noteId].isUpdatedInDb = false;
}

function updateNotesStateObject(updateMsg, config) {
  updateNoteDetailsInObject(updateMsg, notesState, config);
}

function updateLastSyncedNotesStateObject(updateMsg, config) {
  config.skipDbProp = true;
  updateNoteDetailsInObject(updateMsg, lastSyncedNotesState, config);
}

function handleNotePropUpdate(updateMsg, socket, config) {
  const { updatedValue, noteId } = updateMsg;
  socket.join(noteId);
  updateNotesStateObject(updateMsg, config);
}

function handleNoteTitleNameUpdate(updateMsg, socket) {
  handleNotePropUpdate(updateMsg, socket, { property: "title" });
}

function handleNoteContentNameUpdate(updateMsg, socket) {
  handleNotePropUpdate(updateMsg, socket, { property: "content" });
}

function getNotesStateForNoteId(noteId) {
  return notesState[noteId] ?? {};
}

function getNotesState() {
  return JSON.parse(JSON.stringify(notesState));
}

function getLastSyncedNotesState() {
  return JSON.parse(JSON.stringify(lastSyncedNotesState));
}

module.exports = {
  saveAllNotesState,
  handleNoteTitleNameUpdate,
  handleNoteContentNameUpdate,
  getNotesStateForNoteId,
  getNotesState,
  getLastSyncedNotesState,
  updateLastSyncedNotesStateObject
};

setInterval(saveAllNotesState, dbStateUpdateTimeoutInMilliSeconds);
setInterval(clearSavedNotesData, dbStateDeleteTimeoutInMilliSeconds);
