import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let trackingSocket = null;
let chatSocket = null;

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

export const getChatSocket = () => {
  if (!chatSocket) {
    chatSocket = io(`${SOCKET_URL}/chat`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    chatSocket.on('connect', () => {
      console.log('💬 Socket.io connected to /chat namespace');
    });

    chatSocket.on('disconnect', () => {
      console.log('🔌 Socket.io disconnected from /chat');
    });
  }
  return chatSocket;
};

export const disconnectSockets = () => {
  if (trackingSocket) {
    trackingSocket.disconnect();
    trackingSocket = null;
  }
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};
