import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyVehicles, getMyViolations, getMyDocuments, getDocumentsByVehicleId } from '../services/api'
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
  const [myVehicles, setMyVehicles] = useState([])
  const [myViolations, setMyViolations] = useState([])
  const [myDocuments, setMyDocuments] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [vehicle, setVehicle] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const [vehiclesRes, violationsRes, docsRes] = await Promise.all([
          getMyVehicles(),
          getMyViolations(),
          getMyDocuments().catch(() => ({ data: [] })) // Handle case where this endpoint might fail gracefully
        ])
        setMyVehicles(vehiclesRes.data || [])
        setMyViolations(violationsRes.data || [])
        setMyDocuments(docsRes.data || [])
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const handleSelectVehicle = async (vId) => {
    setSelectedVehicleId(vId)
    if (!vId) {
      setVehicle(null)
      setDocuments([])
      setSearched(false)
      return
    }

    const selected = myVehicles.find(v => v.id === vId || v.id === parseInt(vId))
    setVehicle(selected)
    setSearched(true)
    setLoading(true)

    try {
      const docsRes = await getDocumentsByVehicleId(selected.id)
      setDocuments(docsRes.data || [])
    } catch (err) {
      setDocuments([])
      toast.error('Failed to load documents for this vehicle')
    } finally {
      setLoading(false)
    }
  }

  const getDocStatus = (type) => {
    const doc = documents.find(d => d.documentType === type)
    if (!doc) return { status: 'pending', label: 'Not submitted', tick: '—', data: null }
    if (doc.status === 'VERIFIED') return { status: 'verified', label: 'Verified', tick: '✓', data: doc }
    if (doc.status === 'EXPIRED') return { status: 'expired', label: 'Expired', tick: '✗', data: doc }
    return { status: 'pending', label: 'Pending review', tick: '⏳', data: doc }
  }

  const totalVerified = myDocuments.filter(d => d.status === 'VERIFIED').length
  const totalVehicles = myVehicles.length
  const activeViolationsCount = myViolations.filter(v => v.status === 'UNPAID').length

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
            <div className="stat-value">{totalVerified}</div>
            <div className="stat-label">Verified Documents</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalVehicles}</div>
            <div className="stat-label">Registered Vehicles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{activeViolationsCount}</div>
            <div className="stat-label">Active Violations</div>
          </div>
        </div>

        {/* SEARCH PANEL */}
        <section className="search-panel" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="search-panel-content">
            <div className="search-header">
              <h3>Select Vehicle</h3>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Choose a registered vehicle to view its compliance status.</p>
            </div>
            <div className="search-box">
              <select
                className="premium-input"
                value={selectedVehicleId}
                onChange={(e) => handleSelectVehicle(e.target.value)}
                style={{ width: '100%' }}
                disabled={myVehicles.length === 0}
              >
                <option value="">-- {myVehicles.length === 0 ? 'No vehicles registered' : 'Select a vehicle'} --</option>
                {myVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.plateNumber} ({v.make} {v.model})</option>
                ))}
              </select>
            </div>
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
                  <div key={doc.type} className="premium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', width: '100%', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="card-icon" style={{ marginBottom: 0, fontSize: '1.5rem' }}>{doc.icon}</div>
                        <div className="card-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>{doc.label}</div>
                      </div>
                      <div className={`card-status ${status.status}`} style={{ margin: 0 }}>
                        {status.label}
                      </div>
                    </div>
                    
                    {status.data ? (
                      <div style={{ width: '100%', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Ref No:</strong> <span>{status.data.documentReferenceNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Authority:</strong> <span>{status.data.issuingAuthority}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Issued:</strong> <span>{new Date(status.data.issuedDate).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Expires:</strong> <span>{new Date(status.data.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: '100%', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem 0', background: 'var(--bg-main)', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                        No document uploaded yet.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {myViolations.filter(v => v.vehicle?.id === vehicle.id && v.status === 'UNPAID').length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⚠️ Active Violations for this Vehicle</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {myViolations.filter(v => v.vehicle?.id === vehicle.id && v.status === 'UNPAID').map(violation => (
                    <div key={violation.id} className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{violation.violationType?.name || 'Traffic Violation'}</strong>
                          <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                            {new Date(violation.issuedAt).toLocaleDateString()} • {violation.location}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444' }}>
                            ₦{violation.fineAmount?.toLocaleString()}
                          </div>
                          <button className="premium-btn" style={{ padding: '6px 12px', fontSize: '0.75rem', marginTop: '8px', minHeight: 'auto' }} onClick={() => navigate('/violations')}>
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searched && (
          <div className="stat-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Vehicle Not Found</h3>
            <p className="text-secondary">Please select a valid vehicle.</p>
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
