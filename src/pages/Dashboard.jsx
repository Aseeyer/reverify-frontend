import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVehicleByPlateNumber, getDocumentsByVehicleId } from '../services/api'

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
    if (!doc) return { status: 'PENDING', label: 'Not submitted', color: '#f59e0b', bg: '#451a03', tick: '⚠️' }
    if (doc.status === 'VERIFIED') return { status: 'VERIFIED', label: 'Verified', color: '#22c55e', bg: '#052e16', tick: '✅' }
    if (doc.status === 'EXPIRED') return { status: 'EXPIRED', label: 'Expired', color: '#ef4444', bg: '#450a0a', tick: '❌' }
    return { status: 'PENDING', label: 'Pending review', color: '#f59e0b', bg: '#451a03', tick: '⏳' }
  }

  const verifiedCount = documentTypes.filter(d => getDocStatus(d.type).status === 'VERIFIED').length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>reVerify</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.body}>
        <h2 style={styles.greeting}>Document Verification Status</h2>
        <p style={styles.sub}>Enter your plate number to check your documents</p>

        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            style={styles.searchInput}
            placeholder="e.g. ABC123XY"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            required
          />
          <button style={styles.searchBtn} type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {searched && (
          <>
            <div style={styles.grid}>
              {documentTypes.map((doc) => {
                const status = getDocStatus(doc.type)
                return (
                  <div key={doc.type} style={{ ...styles.card, borderColor: status.color }}>
                    <div style={styles.cardTop}>
                      <span style={styles.icon}>{doc.icon}</span>
                      <span style={{ ...styles.badge, color: status.color, backgroundColor: status.bg }}>
                        {status.status}
                      </span>
                    </div>
                    <p style={styles.docLabel}>{doc.label}</p>
                    <p style={{ ...styles.docSub, color: status.color }}>
                      {status.tick} {status.label}
                    </p>
                  </div>
                )
              })}
            </div>

            <div style={{
              ...styles.summaryBox,
              borderColor: verifiedCount === 5 ? '#22c55e' : verifiedCount > 0 ? '#f59e0b' : '#ef4444'
            }}>
              <p style={styles.summaryText}>
                {verifiedCount === 5 ? '✅' : '⚠️'} {verifiedCount} of 5 documents verified
              </p>
              <p style={styles.summaryHint}>
                {verifiedCount === 5
                  ? 'All documents verified. Show this screen to the officer.'
                  : 'Some documents are missing or unverified.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.25rem 2rem', backgroundColor: '#1e293b', borderBottom: '1px solid #334155'
  },
  logo: { color: '#38bdf8', fontSize: '1.5rem', margin: 0 },
  logoutBtn: {
    backgroundColor: 'transparent', border: '1px solid #475569',
    color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '8px',
    cursor: 'pointer', fontSize: '0.9rem'
  },
  body: { maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem' },
  greeting: { fontSize: '1.5rem', marginBottom: '0.25rem' },
  sub: { color: '#94a3b8', marginBottom: '1.5rem' },
  searchRow: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
  searchInput: {
    flex: 1, padding: '0.75rem 1rem', borderRadius: '8px',
    border: '1px solid #334155', backgroundColor: '#1e293b',
    color: '#f1f5f9', fontSize: '0.95rem'
  },
  searchBtn: {
    padding: '0.75rem 1.5rem', backgroundColor: '#38bdf8',
    color: '#0f172a', border: 'none', borderRadius: '8px',
    fontWeight: 'bold', cursor: 'pointer'
  },
  error: { color: '#f87171', marginBottom: '1rem' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem', marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#1e293b', borderRadius: '12px',
    padding: '1.25rem', border: '1px solid'
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  icon: { fontSize: '1.5rem' },
  badge: { fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '4px' },
  docLabel: { fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' },
  docSub: { fontSize: '0.8rem' },
  summaryBox: {
    backgroundColor: '#1e293b', borderRadius: '12px',
    padding: '1.5rem', textAlign: 'center', border: '1px solid'
  },
  summaryText: { fontSize: '1.1rem', marginBottom: '0.5rem' },
  summaryHint: { color: '#94a3b8', fontSize: '0.9rem' }
}