const {
  handleNoteTitleNameUpdate,
  handleNoteContentNameUpdate,
  getNotesState,
  getLastSyncedNotesState,
  updateLastSyncedNotesStateObject,
} = require("./manageNotes");

const noteTitleUpdateEventName = "Note Name Update";
const noteContentUpdateEventName = "Note Content Update";
const serverUpdateEventName = "Server State";
const joinRoomEventName = "joinRoom";

let io;

const clientStateUpdateIntervalInMilliSeconds = 300;
function configureSocketEventListeners(socket, ioInstance) {
  io = ioInstance;
  console.log("a user connected");
  socket.on(noteTitleUpdateEventName, (updateMsg) =>
    handleNoteTitleNameUpdate(updateMsg, socket)
  );
  socket.on(noteContentUpdateEventName, (updateMsg) =>
    handleNoteContentNameUpdate(updateMsg, socket)
  );
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on(joinRoomEventName, (updateMsg) => {
    const { noteId } = updateMsg;
    socket.join(noteId);
  });
  setInterval(
    sendUpdatedStateToClients,
    clientStateUpdateIntervalInMilliSeconds
  );
}
function sendUpdatedStateToClients() {
  const notesState = getNotesState();
  const lastSyncedNotesState = getLastSyncedNotesState();
  Object.entries(notesState).forEach(([noteId, noteProps]) => {
    const lastSyncedNote = lastSyncedNotesState[noteId];
    const updatedNoteProps = {};
    let anyStateUpdated = false;
    const { title, content } = noteProps;
    if (title !== undefined && lastSyncedNote?.title != title) {
      updatedNoteProps.title = title;
      anyStateUpdated = true;
      const updateMsg = { updatedValue: title, noteId };
      updateLastSyncedNotesStateObject(updateMsg, { property: "title" });
    }
    if (content !== undefined && lastSyncedNote?.content != content) {
      updatedNoteProps.content = content;
      anyStateUpdated = true;
      const updateMsg = { updatedValue: content, noteId };
      updateLastSyncedNotesStateObject(updateMsg, { property: "content" });
    }

    if (!anyStateUpdated) {
      return;
    }

    // Emit event to only specific rooms
    // i.e to specific users in that room or working on that note
    // this is an optimization to send only required data to each client
    console.log("sending state to clients, noteId", updatedNoteProps, noteId);
    io.in(noteId).emit(serverUpdateEventName, updatedNoteProps);
  });
}
module.exports = function socketWrapper(io) {
  return (socket) => configureSocketEventListeners(socket, io);
};
