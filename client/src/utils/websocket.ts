import io, { Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

import { EventPayload, Comment, Option, Emoji, Viewer } from '../utils/interfaces.ts';

interface UserPayload {
  roomId: string;
  userName: string;
}

interface UserNameChange {
  id: string;
  oldUsername: string;
  newUsername: string;
}

export const useSocket = (url: string, roomId: string, userName: string) => {
  const socket = useRef<Socket>();
  const userPayload = {roomId, userName} as UserPayload;

  useEffect(() => {
    socket.current = io(url);
    
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server!');
      joinRoom(socket, userPayload);
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      leaveRoom(socket, userPayload);
    });

    const handleBeforeUnload = () => {
      leaveRoom(socket, userPayload);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [url, roomId]);

  return socket;
};

const joinRoom = (
  socket: React.MutableRefObject<Socket | undefined>,
  userPayload: UserPayload
) => {
  if (socket.current) {
    socket.current.emit('joinRoom', userPayload);
  }
};

const leaveRoom = (
  socket: React.MutableRefObject<Socket | undefined>,
  userPayload: UserPayload
) => {
  console.log(userPayload)
  if (socket.current) {
    socket.current.emit('leaveRoom', userPayload);
  }
};

export const useRoomListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (viewer: Viewer) => void
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

export const useNicknameListener = (
  socket: React.MutableRefObject<Socket | undefined>,
  eventName: string,
  callback: (usernameData: UserNameChange) => void
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
  callback: (emoji: Emoji) => void
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

export const reportUsernameChange = (
  socket: React.MutableRefObject<Socket | undefined>, 
  eventName: string,
  eventPayload: EventPayload) => {
  if (socket.current) {
    socket.current.emit(eventName, eventPayload);
  }
};

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