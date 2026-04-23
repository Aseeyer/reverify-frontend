import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyVehicles } from '../services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import '../styles/dashboard.css'

export default function MyVehicles() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    const fetchVehicles = async () => {
      try {
        const res = await getMyVehicles()
        setVehicles(res.data || [])
      } catch (err) {
        console.error('Failed to load vehicles', err)
        toast.error('Could not load vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [navigate])

  return (
    <Layout role={user?.role}>
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
              My Vehicles
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Manage all the vehicles registered to your profile.
            </p>
          </div>
          <button 
            className="premium-btn" 
            style={{ padding: '10px 20px', minHeight: 'auto', width: 'auto' }}
            onClick={() => navigate('/register-vehicle')}
          >
            + Register New Vehicle
          </button>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="stat-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
            <h3>No Vehicles Found</h3>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
              You have not registered any vehicles yet.
            </p>
            <button 
              className="premium-btn" 
              style={{ width: 'auto', margin: '0 auto' }}
              onClick={() => navigate('/register-vehicle')}
            >
              Register Your First Vehicle
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', animation: 'slideUp 0.4s ease-out' }}>
            {vehicles.map((v) => (
              <div key={v.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{v.plateNumber}</h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {v.make} {v.model} • {v.year}
                    </div>
                  </div>
                  <div style={{ padding: '0.35rem 0.75rem', background: 'var(--accent-green-soft)', color: 'var(--accent-green)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {v.color}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>VIN:</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{v.vin}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{v.vehicleType || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="premium-btn" 
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem', minHeight: 'auto' }}
                    onClick={() => navigate('/driver')}
                  >
                    View Dashboard
                  </button>
                  <button 
                    className="premium-btn" 
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem', minHeight: 'auto', background: 'var(--text-main)' }}
                    onClick={() => navigate('/add-document', { state: { vehicleId: v.id } })}
                  >
                    Add Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
