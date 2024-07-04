import { createContext, useEffect, useState, ReactNode } from 'react';
import { isOnline } from '../utils/fetchFunctions.ts'

interface EventContextType  {
  online: boolean;
  loading: boolean;
}

export const EventContext = createContext<EventContextType>({
  online: false,
  loading: true,
});

interface EventProviderProps {
  children: ReactNode;
  projectId?: string;
}

export const EventProvider = ({ children, projectId}: EventProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);

  const checkOnlineStatus = async () => {
    try{
      const onlineStatus = await isOnline(projectId);
      setOnline(onlineStatus);
    } catch(error){
      console.error('Server request error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkOnlineStatus();

  }, [projectId])

  return (
    <EventContext.Provider value={{ loading, online }}>
      {children}
    </EventContext.Provider>
  );
};
