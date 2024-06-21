import './App.css'
import HostView from './components/HostView'
import GuestView from './components/GuestView'
import StatsView from './components/StatsView'
import Login from './components/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';

function ProtectedRoute({ element: Component }){
  const { isLogined } = useContext(AuthContext);

  return isLogined ? Component : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='host' element={<ProtectedRoute element={<HostView />}/>} />
          <Route path='guest' element={<GuestView />} />
          <Route path='stats' element={<StatsView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App
