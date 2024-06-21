import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [isLogined, setIsLogined] = useState(false);

  const login = () => {
    setIsLogined(true);
  }

  const logout = () => {
    setIsLogined(false)
  }

  return (
    <AuthContext.Provider value={{isLogined, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}