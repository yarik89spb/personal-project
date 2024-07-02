import React, { createContext, useState, ReactNode } from 'react';

interface EventContextType  {
  hostId: string | null;
  setHostId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const EventContext = createContext<EventContextType>({
  hostId: null,
  setHostId: () => {},
});

interface EventContextProps {
  children: ReactNode;
}

export const EventProvider = ({ children }: EventContextProps) => {
  const [hostId, setHostId] = useState<string | null>(null);

  return (
    <EventContext.Provider value={{ hostId, setHostId }}>
      {children}
    </EventContext.Provider>
  );
};
