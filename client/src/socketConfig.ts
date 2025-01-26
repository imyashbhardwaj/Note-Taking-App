import { constants } from '../constants';
import { noteType } from './types';
import { io, Socket } from 'socket.io-client';

const { BACKEND_SERVER } = constants;

const  appSocketInstance: Socket | null = io(BACKEND_SERVER.ROOT, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    path: '/api/socket',
  }) as Socket;

function setSocketListener(eventName: string, callback: (noteState: noteType) => void) {
  appSocketInstance?.on(eventName, callback);
}

function emitSocketEvent(eventName: string, data: { [key: string]: string }) {
  console.debug(`sending state to server ${JSON.stringify(data)}`, Date.now());
  appSocketInstance?.emit(eventName, data);
}

appSocketInstance?.on('disconnect', (reason: String) => {
  if (reason === 'io server disconnect') {
    reconnectToSocketInstance();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    reconnectToSocketInstance()
  }
});

window.addEventListener('online', reconnectToSocketInstance);

function reconnectToSocketInstance(){
  if (!appSocketInstance?.connected) appSocketInstance?.connect();
}

export { setSocketListener, emitSocketEvent };
