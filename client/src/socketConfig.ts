const socketCOnnectionPath = '/socket';
import { constants } from '../constants';

const { BACKEND_SERVER } = constants;
const serverUrl = BACKEND_SERVER.URL;
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
