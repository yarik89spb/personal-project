import io, { Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

export const useSocket = (url: string) => {
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io(url);
    
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server!');
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url]);

  return socket;
};

export const sendMessage = (socket: React.MutableRefObject<Socket | undefined>, message: string) => {
  if (socket.current) {
    socket.current.emit('viewerMessage', message);
  }
};

export const useMessageListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (message: string) => void
) => {
  useEffect(() => {
    if (socket.current) {
      socket.current.on(eventName, callback);
    }

    return () => {
      if (socket.current) {
        socket.current.off(eventName, callback);
      }
    };
  }, [socket, eventName, callback]);
};