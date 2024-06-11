import { useState } from 'react'
import './App.css'
import HostView from './components/HostView'
import GuestView from './components/GuestView.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="host" element={<HostView />} />
        <Route path="guest" element={<GuestView />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
