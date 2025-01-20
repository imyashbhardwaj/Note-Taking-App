const {
  handleNoteTitleNameUpdate,
  handleNoteContentNameUpdate,
  getNotesState,
} = require("./manageNotes");

const noteTitleUpdateEventName = "Note Name Update";
const noteContentUpdateEventName = "Note Content Update";
let io;

const clientStateUpdateIntervalInMilliSeconds  = 100;
function configureSocketEventListeners(socket, ioInstance) {
  io = ioInstance;
  socket.on(noteTitleUpdateEventName, (updateMsg) =>
    handleNoteTitleNameUpdate(updateMsg, socket)
  );
  socket.on(noteContentUpdateEventName, (updateMsg) =>
    handleNoteContentNameUpdate(updateMsg, socket)
  );
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  setInterval(sendUpdatedStateToClients, clientStateUpdateIntervalInMilliSeconds);
}
function sendUpdatedStateToClients() {
  const notesState = getNotesState();
  Object.entries(notesState).forEach(([noteId, noteProps]) => {
    const { title, content } = noteProps;
    const updatedNoteProps = {
      ...(title !== undefined && { title }),
      ...(content != undefined && { content }),
    };
    // Emit event to only specific rooms
    // i.e to specific users in that room or working on that note
    // this is an optimization to send only required data to each client
    io.in(noteId).emit("Server State", updatedNoteProps);
  });
}
module.exports = function socketWrapper(io) {
  return (socket) => configureSocketEventListeners(socket, io);
};
