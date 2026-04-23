import { useState } from 'react'
import { registerVehicle, verifyPlateNumberExternal } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import '../styles/dashboard.css'

export default function RegisterVehicle() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [form, setForm] = useState({
    plateNumber: '',
    vin: '',
    manufacturer: '',
    model: '',
    year: '',
    color: '',
    vehicleType: ''
  })

  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleVerifyFRSC = async () => {
    if (!form.plateNumber) {
      toast.error('Please enter a plate number first')
      return
    }

    setVerifying(true)
    try {
      const res = await verifyPlateNumberExternal(form.plateNumber.toUpperCase())
      if (res.data?.status) {
        const externalData = res.data.data
        setForm(prev => ({
          ...prev,
          manufacturer: externalData.make || prev.manufacturer,
          model: externalData.model || prev.model,
          color: externalData.color || prev.color,
        }))
        toast.success('Official FRSC data retrieved!')
      } else {
        toast.error('Official record not found')
      }
    } catch (err) {
      toast.error('Official verification failed.')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

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

      toast.success('Vehicle registered successfully 🚗')
      setTimeout(() => { navigate('/driver') }, 1500)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout role={user?.role}>
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Register New Vehicle
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Provide accurate details or use FRSC Verify to auto-fill your record.
          </p>
        </header>

        <section className="stat-card" style={{ animation: 'slideUp 0.4s ease-out' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Plate Number</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  className="premium-input"
                  name="plateNumber"
                  placeholder="e.g. ABC-123-XY"
                  value={form.plateNumber}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="premium-btn" 
                  style={{ background: 'var(--text-main)', whiteSpace: 'nowrap' }}
                  onClick={handleVerifyFRSC}
                  disabled={verifying}
                >
                  {verifying ? 'Verifying...' : 'Verify with FRSC'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>VIN / Chassis Number</label>
              <input className="premium-input" name="vin" placeholder="17-digit VIN" value={form.vin} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Manufacturer</label>
              <input className="premium-input" name="manufacturer" placeholder="e.g. Toyota" value={form.manufacturer} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Model</label>
              <input className="premium-input" name="model" placeholder="e.g. Camry" value={form.model} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Year</label>
              <input className="premium-input" type="number" name="year" placeholder="YYYY" value={form.year} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Color</label>
              <input className="premium-input" name="color" placeholder="e.g. Silver" value={form.color} onChange={handleChange} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Vehicle Type</label>
              <select className="premium-input" name="vehicleType" value={form.vehicleType} onChange={handleChange} required style={{ width: '100%' }}>
                <option value="">Select vehicle type...</option>
                <option value="CAR">Private Car</option>
                <option value="BUS">Commercial Bus</option>
                <option value="TRUCK">Heavy Duty Truck</option>
                <option value="MOTORCYCLE">Motorcycle</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="premium-btn" type="submit" disabled={loading} style={{ flex: 1, padding: '14px' }}>
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
              <button className="premium-btn" type="button" onClick={() => navigate('/driver')} style={{ background: '#f1f5f9', color: 'var(--text-secondary)', flex: 1 }}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  )
}