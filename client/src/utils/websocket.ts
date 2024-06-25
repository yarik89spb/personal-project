import io, { Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

import { EventPayload, Comment, Option } from '../utils/interfaces.ts';

export const useSocket = (url: string, roomId: string) => {
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io(url);
    
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server!');
      joinRoom(socket, roomId);
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      leaveRoom(socket, roomId);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url, roomId]);

  return socket;
};

export const joinRoom = (
  socket: React.MutableRefObject<Socket | undefined>,
  roomId: string
) => {
  console.log(roomId)
  if (socket.current) {
    socket.current.emit('joinRoom', { roomId });
  }
};

export const leaveRoom = (
  socket: React.MutableRefObject<Socket | undefined>,
  roomId: string
) => {
  if (socket.current) {
    socket.current.emit('leaveRoom', { roomId });
  }
};

/* Host functions */

export const sendCommand = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  eventPayload: EventPayload,
) => {
  if (socket.current) {
    socket.current.emit(eventName, eventPayload);
  }
};

export const useMessageListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (message: Comment) => void
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

export const useEmojiListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (emoji: string) => void
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
  eventPayload: EventPayload) => {
  if (socket.current) {
    socket.current.emit(eventName, eventPayload);
  }
};

export const sendUserAnswer = (
  socket: React.MutableRefObject<Socket | undefined>, 
  eventName: string,
  eventPayload: EventPayload) => {
  if (socket.current) {
    socket.current.emit(eventName, eventPayload);
  }
};

export const sendUserEmoji = (
  socket: React.MutableRefObject<Socket | undefined>, 
  eventName: string,
  eventPayload: EventPayload) => {
  if (socket.current) {
    socket.current.emit(eventName, eventPayload);
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