import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_BACKEND_URL, {

  autoConnect: false, // prevent early connection

  auth: {
    token: null, // set after login
  },
  
  transports: ['websocket'],

});

socket.on('connect_error', (err) => {
  console.error('❌ Socket connect error:', err.message);
});
