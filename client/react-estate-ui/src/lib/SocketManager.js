import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080';
let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket']
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
