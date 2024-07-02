import './App.css'
import HostView from './components/HostView'
import GuestView from './components/GuestView'
import StatsView from './components/StatsView'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Welcome from './components/Welcome'
import HostProfile from './components/HostProfile'
import { EventProvider } from './context/EventContext'

interface ProtectedRouteProps {
  element: ReactNode
}

function ProtectedRoute({ element: Component }: ProtectedRouteProps){
  const { isLogined, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }
  return isLogined ? <> {Component} </> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <div className="app-container">
            <Header/>
            <main className="content">
            <Routes>
              <Route path='' element={<Welcome />} />
              <Route path='login' element={<Login />} />
              <Route path='profile/:userId' element={<ProtectedRoute element={<HostProfile />}/>} />
              <Route path='host/:projectId' element={<ProtectedRoute element={<HostView />}/>} />
              <Route path='guest/:projectId' element={<GuestView />} />
              <Route path='stats/:projectId' element={<ProtectedRoute element={<StatsView />}/>} />
            </Routes>
            </main>
            <Footer/>
          </div>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
    
  )
}

export default App
