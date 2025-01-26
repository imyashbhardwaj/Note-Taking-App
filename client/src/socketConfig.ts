import { constants } from '../constants';
import { io, Socket } from 'socket.io-client';
import type { NoteType } from './types';

const { BACKEND_SERVER } = constants;

const appSocketInstance: Socket | null = io(BACKEND_SERVER.ROOT, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    path: '/api/socket',
  }) as Socket;

function setSocketListener(eventName: string, callback: (noteState: NoteType) => void) {
  appSocketInstance?.on(eventName, callback);
}

function emitSocketEvent(eventName: string, data: { [key: string]: string }) {
  console.debug(`sending state to server ${JSON.stringify(data)}`, Date.now());
  appSocketInstance?.emit(eventName, data);
}


function reconnectToSocketInstance(){
  if (!appSocketInstance?.connected) appSocketInstance?.connect();
}


function initializeSocketBehavior() {
  appSocketInstance?.on('disconnect', (reason: String) => {
    if (reason === 'io server disconnect') {
      reconnectToSocketInstance();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      reconnectToSocketInstance();
    }
  });

  window.addEventListener('online', reconnectToSocketInstance);
}

initializeSocketBehavior();

export { setSocketListener, emitSocketEvent };
