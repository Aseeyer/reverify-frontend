import { useEffect, useState } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { getVehicleByPlateNumber, getDocumentsByVehicleId } from '../services/api'
import '../styles/dashboard.css'
import logo from '../assets/logo.jpg'

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
const [vehicle, setVehicle] = useState(null) 
const [documents, setDocuments] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [searched, setSearched] = useState(false)

const user = JSON.parse(localStorage.getItem('user'))

useEffect(() => {
const token = localStorage.getItem('token')
if (!token) navigate('/')
}, [navigate])

const handleLogout = () => {
localStorage.removeItem('token')
localStorage.removeItem('user')
navigate('/')
}

const handleSearch = async (e) => {
e.preventDefault()
setLoading(true)
setError('')
setSearched(false)


try {
  const vehicleRes = await getVehicleByPlateNumber(plateNumber.toUpperCase())

  const vehicleData = vehicleRes.data
  setVehicle(vehicleData) 

  const docsRes = await getDocumentsByVehicleId(vehicleData.id)
  setDocuments(docsRes.data)

  setSearched(true)
} catch (err) {
  setError('Vehicle not found or no documents available')
  setDocuments([])
  setVehicle(null)
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

const verifiedCount = documentTypes.filter(
d => getDocStatus(d.type).status === 'verified'
).length

return ( <div className="dashboard">


  <header className="dashboard-header">
    <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo" />
      </div>
    
    <div className="header-logo">
      reVerify
      <span>Road Document System</span>
      <small className="welcome-text">
        Welcome, {user?.firstName}
      </small>
    </div>

    <nav className="nav-links">
      <NavLink to="/register-vehicle">Register Vehicle</NavLink>
      <Link to="/violations">Violations</Link>
      <Link to="/laws">Laws</Link>
    </nav>

    <button className="btn-logout" onClick={handleLogout}>
      Sign Out
    </button>
  </header>

  <div className="dashboard-body">

    <h2 className="dashboard-heading">Verification Status</h2>
    <p className="dashboard-sub">
      Enter a plate number to check document status
    </p>

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

    {searched && vehicle && (
      <>
        {/* ✅ VEHICLE INFO */}
        <div className="vehicle-info">
          <h3>{vehicle.plateNumber}</h3>
          <p>{vehicle.manufacturer} {vehicle.model} ({vehicle.year})</p>
        </div>

        {/* ✅ ADD DOCUMENT BUTTON */}
        <div style={{ marginBottom: '20px' }}>
          <button
            className="btn-primary"
            onClick={() =>
              navigate('/add-document', { state: { vehicleId: vehicle.id } })
            }
          >
            + Add Document
          </button>
        </div>

        {/* DOCUMENT GRID */}
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

                <p className="doc-status-text">
                  {status.tick} {status.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* SUMMARY */}
        <div className="summary-box">
          <div className="summary-left">
            <h3>
              {verifiedCount === 5 ? 'All Clear' : 'Incomplete'}
            </h3>

            <p>
              {verifiedCount === 5
                ? 'All documents verified. Present to officer.'
                : `${5 - verifiedCount} document${5 - verifiedCount > 1 ? 's' : ''} missing or unverified`}
            </p>
          </div>

          <div
            className={`summary-score ${
              verifiedCount === 0
                ? 'none'
                : verifiedCount < 5
                ? 'incomplete'
                : ''
            }`}
          >
            {verifiedCount}/5
          </div>
        </div>
      </>
    )}

  </div>

  <footer className="footer">
    <p>© 2026 reVerify • Road Safety Awareness System</p>
  </footer>

</div>

)
}
