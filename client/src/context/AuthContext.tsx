import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [isLogined, setIsLogined] = useState(false);
  const [cookies, setCookie, removeCookie]  = useCookies(['jwt'])

  useEffect(() => {
    const getLoginStance = async () => {
      if(cookies){
        console.log('Found token')
      }else{
        console.log('Missing token')
      }
    }
    getLoginStance();
  }, [cookies])
  

  const login = (userJWT: string) => {
    setIsLogined(true);
    setCookie('jwt', userJWT, { path: '/' });
  }

  const logout = () => {
    setIsLogined(false)
    removeCookie('jwt', { path: '/' });
  }

  return (
    <AuthContext.Provider value={{isLogined, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}