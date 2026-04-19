import { useState } from 'react'
import { registerVehicle } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../styles/login.css'

export default function RegisterVehicle() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    plateNumber: '',
    vin: '',
    manufacturer: '',
    model: '',
    year: '',
    color: '',
    vehicleType: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await registerVehicle({
        ...form,
        plateNumber: form.plateNumber.trim().toUpperCase(),
        vin: form.vin.trim().toUpperCase(),
        manufacturer: form.manufacturer.trim(),
        model: form.model.trim(),
        color: form.color.trim(),
        year: Number(form.year)
      })

      toast.success('Vehicle registered successfully 🚗', {
        duration: 3000,
        style: {
          background: '#16a34a',
          color: '#fff'
        }
      })
      setTimeout(() => {navigate('/dashboard')}, 1500)

    } catch (err) {
      setError(
        err.response?.data?.details ||
        err.response?.data?.error ||
        'Vehicle registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">

        <div className="auth-logo">
          <h1>reVerify</h1>
          <span>Register Vehicle</span>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group">
              <label>Plate Number</label>
              <input
                className="form-input"
                name="plateNumber"
                value={form.plateNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>VIN</label>
              <input
                className="form-input"
                name="vin"
                value={form.vin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Manufacturer</label>
            <input
              className="form-input"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Model</label>
            <input
              className="form-input"
              name="model"
              value={form.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              className="form-input"
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <input
              className="form-input"
              name="color"
              value={form.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select
              className="form-input"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="CAR">Car</option>
              <option value="BUS">Bus</option>
              <option value="TRUCK">Truck</option>
              <option value="MOTORCYCLE">Motorcycle</option>
            </select>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Vehicle'}
          </button>

        </form>

        <p className="auth-footer">
          Back to <Link to="/dashboard">Dashboard</Link>
        </p>

      </div>
    </div>
  )
}