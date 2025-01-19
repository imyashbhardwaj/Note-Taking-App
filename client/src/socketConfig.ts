const socketCOnnectionPath = '/socket';
const serverUrl = 'http://localhost:3001';

const socket = io(serverUrl, {
  path: socketCOnnectionPath,
});

function setSocketListener(eventName: string, callback) {
  socket.on(eventName, callback);
}

function emitSocketEvent(eventName: string, data) {
  socket.emit(eventName, data);
}

export { setSocketListener, emitSocketEvent };
