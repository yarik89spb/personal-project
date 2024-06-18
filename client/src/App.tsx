import './App.css'
import HostView from './components/HostView'
import GuestView from './components/GuestView'
import StatsView from './components/StatsView'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="host" element={<HostView />} />
        <Route path="guest" element={<GuestView />} />
        <Route path="stats" element={<StatsView />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
