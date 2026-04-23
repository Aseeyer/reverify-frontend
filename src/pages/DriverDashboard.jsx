import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVehicleByPlateNumber, getDocumentsByVehicleId } from '../services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import '../styles/dashboard.css'

const documentTypes = [
  { type: 'VEHICLE_LICENSE', label: 'Vehicle License', icon: '🪪' },
  { type: 'ROAD_WORTHINESS', label: 'Road Worthiness', icon: '🔧' },
  { type: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { type: 'PROOF_OF_OWNERSHIP', label: 'Proof of Ownership', icon: '📄' },
  { type: 'HACKNEY_PERMIT', label: 'Hackney Permit', icon: '🚕' },
]

export default function DriverDashboard() {
  const navigate = useNavigate()
  const [plateNumber, setPlateNumber] = useState('')
  const [vehicle, setVehicle] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/')
  }, [navigate])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSearched(false)

    try {
      const vehicleRes = await getVehicleByPlateNumber(plateNumber.toUpperCase())
      const vehicleData = vehicleRes.data
      setVehicle(vehicleData)

      const docsRes = await getDocumentsByVehicleId(vehicleData.id)
      setDocuments(docsRes.data)
      setSearched(true)
    } catch (err) {
      setDocuments([])
      setVehicle(null)
      setSearched(true)
      toast.error('Vehicle not found in our records')
    } finally {
      setLoading(false)
    }
  }

  const getDocStatus = (type) => {
    const doc = documents.find(d => d.documentType === type)
    if (!doc) return { status: 'pending', label: 'Not submitted', tick: '—' }
    if (doc.status === 'VERIFIED') return { status: 'verified', label: 'Verified', tick: '✓' }
    if (doc.status === 'EXPIRED') return { status: 'expired', label: 'Expired', tick: '✗' }
    return { status: 'pending', label: 'Pending review', tick: '⏳' }
  }

  const verifiedCount = documentTypes.filter(d => getDocStatus(d.type).status === 'verified').length

  return (
    <Layout role="DRIVER">
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Welcome, {user?.firstName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            RoadCheck Nigeria • Secure Document Hub
          </p>
        </header>

        {/* QUICK STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{verifiedCount}</div>
            <div className="stat-label">Verified Documents</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Registered Vehicles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Active Violations</div>
          </div>
        </div>

        {/* SEARCH PANEL */}
        <section className="search-panel" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="search-panel-content">
            <div className="search-header">
              <h3>Quick Verification</h3>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Check compliance status for any of your registered vehicles.</p>
            </div>
            <form className="search-box" onSubmit={handleSearch}>
              <input
                className="premium-input"
                placeholder="e.g. ABC-123-XY"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                required
              />
              <button className="premium-btn" type="submit" disabled={loading}>
                {loading ? '...' : 'Verify Status'}
              </button>
            </form>
          </div>
        </section>

        {searched && vehicle ? (
          <div style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="section-title" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>{vehicle.plateNumber}</h2>
                <p className="text-secondary">{vehicle.make} {vehicle.model} • {vehicle.color}</p>
              </div>
              <button 
                className="premium-btn" 
                style={{ padding: '8px 16px', fontSize: '0.8rem', minHeight: 'auto' }}
                onClick={() => navigate('/add-document', { state: { vehicleId: vehicle.id } })}
              >
                + Add Document
              </button>
            </div>

            <div className="doc-premium-grid">
              {documentTypes.map((doc) => {
                const status = getDocStatus(doc.type)
                return (
                  <div key={doc.type} className="premium-card">
                    <div className="card-icon">{doc.icon}</div>
                    <div className="card-title">{doc.label}</div>
                    <div className={`card-status ${status.status}`}>
                      {status.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : searched && (
          <div className="stat-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Vehicle Not Found</h3>
            <p className="text-secondary">No vehicle found with plate number "{plateNumber}".</p>
            <button className="premium-btn" style={{ marginTop: '1.5rem', width: 'auto', marginInline: 'auto' }} onClick={() => navigate('/register-vehicle')}>
              Register Vehicle
            </button>
          </div>
        )}

        {!searched && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="stat-card">
              <h3>Road Safety Tips</h3>
              <ul style={{ listStyle: 'none', marginTop: '1rem', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>✅ Keep your digital documents accessible.</li>
                <li style={{ marginBottom: '10px' }}>✅ Check insurance validity before long trips.</li>
                <li style={{ marginBottom: '10px' }}>✅ Report any road safety violations.</li>
              </ul>
            </div>
            <div className="stat-card" style={{ background: 'var(--accent-green-soft)', borderColor: 'var(--accent-green)' }}>
              <h3>Latest Regulation</h3>
              <p className="text-secondary" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Federal Ministry of Transport has updated the Proof of Ownership requirements.
              </p>
              <button className="premium-btn" style={{ marginTop: '1rem', background: 'var(--text-main)', minHeight: '36px' }} onClick={() => navigate('/laws')}>
                Read Update
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
