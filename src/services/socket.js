import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let trackingSocket = null;

export const getTrackingSocket = () => {
  if (!trackingSocket) {
    trackingSocket = io(`${SOCKET_URL}/tracking`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    trackingSocket.on('connect', () => {
      console.log('⚡ Socket.io connected to /tracking namespace');
    });

    trackingSocket.on('disconnect', () => {
      console.log('🔌 Socket.io disconnected from /tracking');
    });
  }
  return trackingSocket;
};

export const disconnectSocket = () => {
  if (trackingSocket) {
    trackingSocket.disconnect();
    trackingSocket = null;
  }
};
