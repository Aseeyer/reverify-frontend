import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVehicleByPlateNumber, getDocumentsByVehicleId } from '../services/api'
import '../styles/dashboard.css'

const documentTypes = [
  { type: 'VEHICLE_LICENSE', label: 'Vehicle License', icon: '🪪' },
  { type: 'ROAD_WORTHINESS', label: 'Road Worthiness', icon: '🔧' },
  { type: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { type: 'PROOF_OF_OWNERSHIP', label: 'Proof of Ownership', icon: '📄' },
  { type: 'HACKNEY_PERMIT', label: 'Hackney Permit', icon: '🚕' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [plateNumber, setPlateNumber] = useState('')
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSearched(false)
    try {
      const vehicleRes = await getVehicleByPlateNumber(plateNumber.toUpperCase())
      const vehicleId = vehicleRes.data.id
      const docsRes = await getDocumentsByVehicleId(vehicleId)
      setDocuments(docsRes.data)
      setSearched(true)
    } catch (err) {
      setError('Vehicle not found or no documents available')
      setDocuments([])
      setSearched(true)
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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-logo">
          reVerify
          <span>Road Document System</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
      </header>

      <div className="dashboard-body">
        <h2 className="dashboard-heading">Verification Status</h2>
        <p className="dashboard-sub">Enter a plate number to check document status</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Enter plate number"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            required
          />
          <button className="btn-search" type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Verify'}
          </button>
        </form>

        {error && <div className="search-error">{error}</div>}

        {searched && (
          <>
            <div className="docs-grid">
              {documentTypes.map((doc) => {
                const status = getDocStatus(doc.type)
                return (
                  <div key={doc.type} className={`doc-card ${status.status}`}>
                    <div className="doc-card-top">
                      <span className="doc-icon">{doc.icon}</span>
                      <span className={`doc-badge ${status.status}`}>
                        {status.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="doc-label">{doc.label}</p>
                    <p className="doc-status-text">{status.tick} {status.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="summary-box">
              <div className="summary-left">
                <h3>{verifiedCount === 5 ? 'All Clear' : 'Incomplete'}</h3>
                <p>{verifiedCount === 5
                  ? 'All documents verified. Present to officer.'
                  : `${5 - verifiedCount} document${5 - verifiedCount > 1 ? 's' : ''} missing or unverified`}
                </p>
              </div>
              <div className={`summary-score ${verifiedCount === 0 ? 'none' : verifiedCount < 5 ? 'incomplete' : ''}`}>
                {verifiedCount}/5
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}