import { useState } from 'react'
import { getVehicleByPlateNumber, getDocumentsByVehicleId } from '../services/api'
import '../styles/dashboard.css'
import toast from 'react-hot-toast'

const documentTypes = [
  { type: 'VEHICLE_LICENSE', label: 'Vehicle License', icon: '🪪' },
  { type: 'ROAD_WORTHINESS', label: 'Road Worthiness', icon: '🔧' },
  { type: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { type: 'PROOF_OF_OWNERSHIP', label: 'Proof of Ownership', icon: '📄' },
  { type: 'HACKNEY_PERMIT', label: 'Hackney Permit', icon: '🚕' },
]

export default function OfficerDashboard() {
  const [plateNumber, setPlateNumber] = useState('')
  const [vehicle, setVehicle] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setVehicle(null)
    setDocuments([])
    setSearched(false)

    try {
      const vehicleRes = await getVehicleByPlateNumber(plateNumber.toUpperCase())
      const vehicleData = vehicleRes.data
      setVehicle(vehicleData)

      const docsRes = await getDocumentsByVehicleId(vehicleData.id)
      setDocuments(docsRes.data)

      setSearched(true)
    } catch (err) {
      toast.error('Vehicle not found')
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const getDocStatus = (type) => {
    const doc = documents.find(d => d.documentType === type)

    if (!doc) return { status: 'pending', label: 'Not submitted', color: 'gray' }
    if (doc.status === 'VERIFIED') return { status: 'verified', label: 'Verified', color: 'green' }
    if (doc.status === 'EXPIRED') return { status: 'expired', label: 'Expired', color: 'red' }

    return { status: 'pending', label: 'Pending', color: 'orange' }
  }

  const verifiedCount = documentTypes.filter(
    d => getDocStatus(d.type).status === 'verified'
  ).length

  const isCleared = verifiedCount === documentTypes.length

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div className="header-logo">
          Officer Panel
          <span>Road Verification System</span>
        </div>
      </header>

      <div className="dashboard-body">

        <h2 className="dashboard-heading">Vehicle Inspection</h2>
        <p className="dashboard-sub">
          Enter plate number to verify driver documents
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
            {loading ? 'Checking...' : 'Search'}
          </button>
        </form>

        {searched && vehicle && (
          <>
            {/* VEHICLE INFO */}
            <div className="vehicle-info">
              <h3>{vehicle.plateNumber}</h3>
              <p>{vehicle.manufacturer} {vehicle.model} ({vehicle.year})</p>
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
                    <p className="doc-status-text">{status.label}</p>
                  </div>
                )
              })}
            </div>

            {/* FINAL DECISION */}
            <div className="summary-box">
              <div className="summary-left">
                <h3>{isCleared ? 'CLEARED ✅' : 'NOT CLEARED ❌'}</h3>
                <p>
                  {isCleared
                    ? 'All documents valid. Driver can proceed.'
                    : `${documentTypes.length - verifiedCount} document(s) missing or invalid`}
                </p>
              </div>

              <div className={`summary-score ${isCleared ? '' : 'incomplete'}`}>
                {verifiedCount}/{documentTypes.length}
              </div>
            </div>
          </>
        )}

      </div>

      <footer className="footer">
        <p>© 2026 reVerify • Officer Verification System</p>
      </footer>

    </div>
  )
}