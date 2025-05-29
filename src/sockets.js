import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('🔌 Socket connected:', socket.id);
});

// example event listeners
socket.on('order-updated', (order) => {
  console.log('Order updated:', order);
});

export default socket;
