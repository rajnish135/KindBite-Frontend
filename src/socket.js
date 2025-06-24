import { io } from 'socket.io-client';

// export const socket = io('http://localhost:5000', {
//   autoConnect: false,  
// });

// Problem: 
// autoConnect: false 
// disables connection by default
// If you’re not manually calling socket.connect() anywhere, your client will never connect

export const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
