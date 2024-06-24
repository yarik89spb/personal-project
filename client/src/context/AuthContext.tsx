import { createContext, useState, useEffect, ReactNode } from 'react';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  isLogined: boolean;
  login: (userJWT: string, userData: UserData) => void;
  logout: () => void;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
}

interface UserData {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isLogined: false,
  userEmail: null,
  userName: null,
  userId: null,
  login: (userJWT: string) => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children } : AuthProviderProps){
  const [isLogined, setIsLogined] = useState(false);
  const [cookies, setCookie, removeCookie]  = useCookies(['jwt'])
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const getLoginStance = async () => {
      if(cookies.jwt){
        console.log('Found token')
        try{
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${cookies.jwt}`,
            },
          });
          console.log(response)
          if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`${errorData.text}`);
          }
          setIsLogined(true)
        } catch(error){
          setIsLogined(false)
        }
        
      }else{
        console.log('Missing token')
        setIsLogined(false)
      }
    }
    getLoginStance();
  }, [cookies])
  

  const login = (userJWT: string, userData: UserData) => {
    setIsLogined(true);
    setCookie('jwt', userJWT, { path: '/' });
    setUserData(userData);
  }

  const logout = () => {
    setIsLogined(false)
    removeCookie('jwt', { path: '/' });
    setUserData(null);
  }

  return (
    <AuthContext.Provider value={{
      isLogined,
      login,
      logout,
      userId: userData?.userId || null,
      userEmail: userData?.userEmail || null,
      userName: userData?.userName || null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}