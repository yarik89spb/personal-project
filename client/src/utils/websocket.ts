import io, { Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

import { Option,  Answer } from '../utils/interfaces.ts';

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

/* Host functions */

export const sendCommand = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  passedData: object,
) => {
  if (socket.current) {
    socket.current.emit(eventName, passedData);
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

export const useAnswerListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (answer: Option) => void
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

/* Guest functions */

export const sendMessage = (
  socket: React.MutableRefObject<Socket | undefined>, 
  eventName: string,
  message: string) => {
  if (socket.current) {
    socket.current.emit(eventName, message);
  }
};

export const sendUserAnswer = (
  socket: React.MutableRefObject<Socket | undefined>, 
  eventName: string,
  userAnswer: Answer) => {
  if (socket.current) {
    socket.current.emit(eventName, userAnswer);
  }
};

export const useCommandListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (passedData: object) => void
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