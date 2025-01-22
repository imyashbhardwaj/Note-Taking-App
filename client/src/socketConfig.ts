
import { constants } from '../constants';

const { BACKEND_SERVER } = constants;
const serverUrl = BACKEND_SERVER.URL;
const socket = io("http://35.209.161.69/", {
  path: "/api/socket"
});

function setSocketListener(eventName: string, callback) {
  socket.on(eventName, callback);
}

function emitSocketEvent(eventName: string, data) {
 
	console.log(`sending state ${JSON.stringify(data)}`,Date.now() );
	socket.emit(eventName, data);
}

export { setSocketListener, emitSocketEvent };
