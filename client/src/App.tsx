import './App.css'
import HostView from './components/HostView'
import GuestView from './components/GuestView'
import StatsView from './components/StatsView'
import Header from './components/Header'
import Login from './components/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Welcome from './components/Welcome'
import HostProfile from './components/HostProfile'

interface ProtectedRouteProps {
  element: ReactNode
}

function ProtectedRoute({ element: Component }: ProtectedRouteProps){
  const { isLogined } = useContext(AuthContext);

  return isLogined ? Component : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='' element={<Welcome />} />
          <Route path='login' element={<Login />} />
          <Route path='profile/:userId' element={<ProtectedRoute element={<HostProfile />}/>} />
          <Route path='host/:projectId' element={<ProtectedRoute element={<HostView />}/>} />
          <Route path='guest/:projectId' element={<GuestView />} />
          <Route path='stats/:projectId' element={<ProtectedRoute element={<StatsView />}/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App
