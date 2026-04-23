import { useState } from 'react'
import { getVehicleByPlateNumber, getDocumentsByVehicleId, issueViolation } from '../services/api'
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

export default function OfficerDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('plate') // 'plate' or 'driverId'
  const [vehicle, setVehicle] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showViolationModal, setShowViolationModal] = useState(false)
  const [violationForm, setViolationForm] = useState({ title: '', amount: '' })

  const user = JSON.parse(localStorage.getItem('user'))

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setVehicle(null)
    setDocuments([])
    setSearched(false)

    try {
      let vehicleData;
      if (searchType === 'plate') {
        const vehicleRes = await getVehicleByPlateNumber(searchQuery.toUpperCase())
        vehicleData = vehicleRes.data
      } else {
        // Mock search by driver ID for demo
        toast.error('Search by Driver ID coming soon. Using fallback.')
        return;
      }
      
      setVehicle(vehicleData)
      const docsRes = await getDocumentsByVehicleId(vehicleData.id)
      setDocuments(docsRes.data)
      setSearched(true)
    } catch (err) {
      toast.error('Record not found')
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleIssueViolation = async (e) => {
    e.preventDefault()
    try {
      await issueViolation({ ...violationForm, vehicleId: vehicle.id })
      toast.success('Violation issued successfully')
      setShowViolationModal(false)
      setViolationForm({ title: '', amount: '' })
    } catch (err) {
      toast.error('Failed to issue violation')
    }
  }

  const getDocStatus = (type) => {
    const doc = documents.find(d => d.documentType === type)
    if (!doc) return { status: 'pending', label: 'Not submitted' }
    if (doc.status === 'VERIFIED') return { status: 'verified', label: 'Verified' }
    if (doc.status === 'EXPIRED') return { status: 'expired', label: 'Expired' }
    return { status: 'pending', label: 'Pending' }
  }

  const verifiedCount = documentTypes.filter(d => getDocStatus(d.type).status === 'verified').length
  const isCleared = verifiedCount === documentTypes.length

  return (
    <Layout role="OFFICER">
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Verification Terminal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Officer {user?.lastName} • Active Session
          </p>
        </header>

        {/* SEARCH PANEL */}
        <section className="search-panel">
          <div className="search-panel-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Vehicle Inspection</h3>
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-light)' }}
              >
                <option value="plate">Plate Number</option>
                <option value="driverId">Driver ID / NIN</option>
              </select>
            </div>
            <form className="search-box" onSubmit={handleSearch}>
              <input
                className="premium-input"
                placeholder={searchType === 'plate' ? "ABC-123-XY" : "Enter NIN or User ID"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button className="premium-btn" type="submit" disabled={loading}>
                {loading ? 'Scanning...' : 'Verify Status'}
              </button>
            </form>
          </div>
        </section>

        {searched && vehicle ? (
          <div style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>{vehicle.plateNumber}</h2>
                <p className="text-secondary">{vehicle.make} {vehicle.model} • {vehicle.color}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className={`card-status ${isCleared ? 'verified' : 'expired'}`} style={{ padding: '8px 16px', borderRadius: '8px' }}>
                  {isCleared ? '✓ FULLY CLEARED' : '⚠ NON-COMPLIANT'}
                </span>
                {!isCleared && (
                  <button className="premium-btn" style={{ background: '#ef4444', minHeight: 'auto', padding: '8px 16px' }} onClick={() => setShowViolationModal(true)}>
                    Flag Driver
                  </button>
                )}
              </div>
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

            <div className="stat-card" style={{ marginTop: '2.5rem', borderLeft: `6px solid ${isCleared ? '#B2C9AB' : '#ef4444'}`, background: 'white' }}>
               <h3 style={{ color: isCleared ? '#166534' : '#991b1b', marginBottom: '0.5rem' }}>
                 Official Assessment
               </h3>
               <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                 {isCleared ? 'This vehicle is officially authorized for road use. No further action required.' : 'One or more required documents are missing or expired. Vehicle has been flagged for non-compliance.'}
               </p>
            </div>
          </div>
        ) : searched && (
          <div className="stat-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
            <h3>Vehicle Not Found</h3>
            <p className="text-secondary">No digital records for "{searchQuery}" in our database.</p>
          </div>
        )}

        {/* VIOLATION MODAL */}
        {showViolationModal && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="stat-card" style={{ width: '100%', maxWidth: '400px', background: 'white' }}>
               <h3>Issue Road Violation</h3>
               <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Assign a penalty to {vehicle?.plateNumber}.</p>
               <form onSubmit={handleIssueViolation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Violation Title</label>
                    <input 
                      className="premium-input" 
                      placeholder="e.g. Speeding" 
                      value={violationForm.title}
                      onChange={(e) => setViolationForm({...violationForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Fine Amount (₦)</label>
                    <input 
                      className="premium-input" 
                      type="number" 
                      placeholder="5000" 
                      value={violationForm.amount}
                      onChange={(e) => setViolationForm({...violationForm, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                    <button type="button" className="premium-btn" style={{ flex: 1, background: '#e2e8f0', color: '#475569' }} onClick={() => setShowViolationModal(false)}>Cancel</button>
                    <button type="submit" className="premium-btn" style={{ flex: 2, background: '#ef4444' }}>Confirm Issue</button>
                  </div>
               </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}