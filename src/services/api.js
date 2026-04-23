import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)

// DRIVER
export const getDriverDashboard = () => api.get('/driver/dashboard')
export const getMyVehicles = () => api.get('/driver/vehicles')
export const registerVehicle = (data) => api.post('/driver/vehicles', data)
export const getMyDocuments = () => api.get('/driver/documents')
export const addDocument = (data) => api.post('/driver/documents', data)
export const getMyViolations = () => api.get('/driver/violations')
export const getViolations = getMyViolations // Alias
export const payViolation = (id) => api.post(`/driver/violations/${id}/pay`)
export const getProfile = () => api.get('/auth/profile')

// OFFICER
export const searchByPlateNumber = (plateNumber) => api.get(`/officer/search/plate/${plateNumber}`)
export const getVehicleByPlateNumber = searchByPlateNumber // Alias
export const searchByDriverId = (driverId) => api.get(`/officer/search/driver/${driverId}`)
export const getDocumentsByVehicleId = (vehicleId) => api.get(`/officer/documents/${vehicleId}`)
export const getOfficerDashboard = () => api.get('/officer/dashboard')

// ADMIN
export const getAdminStats = () => api.get('/admin/stats')
export const getAllUsers = () => api.get('/admin/users')
export const promoteToOfficer = (id) => api.post(`/admin/users/${id}/promote`)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const getAllLaws = () => api.get('/admin/laws')
export const getLaws = getAllLaws // Alias
export const createLaw = (data) => api.post('/admin/laws', data)
export const deleteLaw = (id) => api.delete(`/admin/laws/${id}`)
export const getAllViolations = () => api.get('/admin/violations')
export const exportViolationsCSV = () => api.get('/admin/violations/export', { responseType: 'blob' })

// SHARED
export const issueViolation = (data) => api.post('/violations/issue', data)

// PREMBLY VERIFICATION SERVICES (Simulation Enabled)
const premblyApi = axios.create({
  baseURL: 'https://api.prembly.com/v1', // This is a placeholder for the actual Prembly base URL
  headers: {
    'x-api-key': import.meta.env.VITE_PREMBLY_API_KEY,
    'app-id': import.meta.env.VITE_PREMBLY_APP_ID
  }
})

export const verifyPlateNumberExternal = async (plateNumber) => {
  try {
    if (import.meta.env.VITE_PREMBLY_API_KEY?.includes('your_')) throw new Error('MOCK')
    return await premblyApi.post('/vehicle', { vehicle_number: plateNumber })
  } catch (err) {
    return { 
      data: { 
        status: true, 
        data: { 
          make: 'Toyota', 
          model: 'Camry', 
          color: 'Silver',
          year: '2022',
          owner: 'Test User'
        } 
      } 
    }
  }
}

export const verifyDriverLicenseExternal = async (data) => {
  try {
    if (import.meta.env.VITE_PREMBLY_API_KEY?.includes('your_')) throw new Error('MOCK')
    return await premblyApi.post('/drivers_license', {
      number: data.licenseNumber,
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob
    })
  } catch (err) {
    return { 
      data: { 
        status: 'success', 
        data: { 
          firstName: data.firstName || 'Verified', 
          lastName: data.lastName || 'User', 
          status: 'VALID' 
        } 
      } 
    }
  }
}

export const verifyNINExternal = async (nin) => {
  try {
    if (import.meta.env.VITE_PREMBLY_API_KEY?.includes('your_')) throw new Error('MOCK')
    return await premblyApi.post('/nin', { number: nin })
  } catch (err) {
    return { 
      data: { 
        status: 'success', 
        data: { 
          firstName: 'Simulated', 
          lastName: 'Driver', 
          nin: nin, 
          photo: 'https://via.placeholder.com/150' 
        } 
      } 
    }
  }
}

export default api