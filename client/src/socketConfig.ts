import { constants } from '../constants';
import { noteType } from './types';

const { BACKEND_SERVER } = constants;
const socket = io(BACKEND_SERVER.SOCKET_HOST, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  pingInterval: 25000,
  pingTimeout: 60000,
  path: '/api/socket',
});

function setSocketListener(eventName: string, callback: (noteState: noteType) => void) {
  socket.on(eventName, callback);
}

function emitSocketEvent(eventName: string, data: { [key: string]: string }) {
  console.log(`sending state ${JSON.stringify(data)}`, Date.now());
  socket.emit(eventName, data);
}

socket.on('disconnect', (reason: String) => {
  if (reason === 'io server disconnect') {
    socket.connect(); // Reconnect if the server disconnected the socket
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (!socket.connected) {
      socket.connect();
    }
  }
});

window.addEventListener('online', () => {
  if (!socket.connected) {
    socket.connect();
  }
});

export { setSocketListener, emitSocketEvent };
