import { createContext, useState, useEffect, ReactNode } from 'react';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  isLogined: boolean;
  login: (userJWT: string, userData: UserData) => void;
  logout: () => void;
  verifyToken: (jwt:string) => void;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
}

interface UserData {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userCompany: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isLogined: false,
  userEmail: null,
  userName: null,
  userId: null,
  login: () => {},
  logout: () => {},
  verifyToken: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children } : AuthProviderProps){
  const [isLogined, setIsLogined] = useState(false);
  const [cookies, setCookie, removeCookie]  = useCookies(['jwt'])
  const [userData, setUserData] = useState<UserData | null>(null);

  const verifyToken = async (jwt: string) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`${errorData.text}`);
      }
      const jwtPayload = await response.json();
      setIsLogined(true)
      setUserData({
        userId: jwtPayload.userId, 
        userEmail: jwtPayload.userEmail,
        userName: jwtPayload.userName,
        userCompany: jwtPayload.userCompany})
    } catch(error){
      console.error('Token verification error:', error);
      setIsLogined(false)
      removeCookie('jwt', { path: '/' });
    }
  }

  useEffect(() => {
    const jwt = cookies.jwt;
    if(jwt){
      console.log('Found token')
      verifyToken(jwt);
    }else{
      console.log('No token found')
      setIsLogined(false);
    }
  }, [cookies.jwt])
  

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
      verifyToken,
      userId: userData?.userId || null,
      userEmail: userData?.userEmail || null,
      userName: userData?.userName || null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}