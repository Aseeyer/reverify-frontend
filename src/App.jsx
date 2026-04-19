import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Violations from './pages/Violations'
import Laws from './pages/Laws'
import RegisterVehicle from './pages/RegisterVehicle'
import { Toaster } from 'react-hot-toast'
import AddDocument from './pages/AddDocument'



function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/laws" element={<Laws />} />
        <Route path="/register-vehicle" element={<RegisterVehicle />} />
        <Route path="/add-document" element={<AddDocument />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App