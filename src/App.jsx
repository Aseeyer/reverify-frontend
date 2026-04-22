import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DriverDashboard from './pages/DriverDashboard'
import OfficerDashboard from './pages/OfficerDashboard'
import AdminDashboard from './pages/AdminDashboard.jsx'

import Violations from './pages/Violations'
import Laws from './pages/Laws'
import RegisterVehicle from './pages/RegisterVehicle'
import AddDocument from './pages/AddDocument'

import ProtectedRoute from './components/ProtectedRoute'

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DRIVER */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={['DRIVER']}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* OFFICER */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRoles={['OFFICER']}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* SHARED */}
        <Route path="/violations" element={<Violations />} />
        <Route path="/laws" element={<Laws />} />
        <Route path="/register-vehicle" element={<RegisterVehicle />} />
        <Route path="/add-document" element={<AddDocument />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App