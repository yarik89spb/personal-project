import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [isLogined, setIsLogined] = useState(false);
  const [cookies, setCookie, removeCookie]  = useCookies(['token'])

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
  

  const login = () => {
    setIsLogined(true);
    setCookie('token', 'test');
  }

  const logout = () => {
    setIsLogined(false)
    removeCookie('token');
  }

  return (
    <AuthContext.Provider value={{isLogined, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}