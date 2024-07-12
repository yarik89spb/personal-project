import './App.css'
import HostView from './components/HostView'
import GuestView from './components/GuestView'
import StatsView from './components/StatsView'
import Header from './components/Header'
import NotFound from './components/NotFound'
import Login from './components/Login'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ReactNode, useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { EventProvider, EventContext } from './context/EventContext';
import Welcome from './components/Welcome'
import HostProfile from './components/HostProfile'
import ProjectPreview from './components/ProjectPreview'

interface ProtectedRouteProps {
  element: ReactNode
}

function ProtectedRoute({ element: Component }: ProtectedRouteProps){
  const { isLogined, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Loading...</div>;
  }
  return isLogined ? <> {Component} </> : <Navigate to="/login" />;
}

const EventRoute = ({ element: Component }: ProtectedRouteProps) => {
  const { online, loading } = useContext(EventContext);

  useEffect(() => {
  if (!loading && !online) {
    console.error('Event is offline')
    alert('The event is currently not online.');
  }
  }, [loading, online]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return online ? <>{Component}</>: <Navigate to="/"/>;
}

function GuestRouteWrapper({ element: Component }: ProtectedRouteProps) {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <EventProvider projectId={projectId!}>
      <EventRoute element={Component} />
    </EventProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header/>
          <main className="content">
          <Routes>
            <Route path='' element={<Welcome />} />
            <Route path='login' element={<Login />} />
            <Route path='profile/:userId' element={<ProtectedRoute element={<HostProfile />}/>} />
            <Route path='host/:projectId' element={<ProtectedRoute element={<HostView />}/>} />
            <Route path="guest/:projectId" element={<GuestRouteWrapper element={<GuestView />} />} />
            <Route path='stats/:projectId' element={<ProtectedRoute element={<StatsView />}/>} />
            <Route path='preview/:projectId' element={<ProtectedRoute element={<ProjectPreview />}/>} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
