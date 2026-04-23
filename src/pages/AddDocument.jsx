import { useState } from 'react'
import { addDocument } from '../services/api'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import '../styles/dashboard.css'

export default function AddDocument() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))
  const initialVehicleId = location.state?.vehicleId || ''

  const [form, setForm] = useState({
    vehicleId: initialVehicleId,
    documentType: '',
    documentReferenceNumber: '',
    issuingAuthority: '',
    issuedDate: '',
    expiryDate: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDocument({
        ...form,
        issuedDate: new Date(form.issuedDate).toISOString(),
        expiryDate: new Date(form.expiryDate).toISOString()
      })

      toast.success('Document added successfully 📑')
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
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Upload Document
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Attach official road documents to your vehicle for digital verification.
            </p>
          </header>

          <section className="stat-card" style={{ width: '100%', animation: 'slideUp 0.4s ease-out' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Vehicle ID / Plate Reference</label>
                <input
                  className="premium-input"
                  name="vehicleId"
                  value={form.vehicleId}
                  onChange={handleChange}
                  placeholder="Enter vehicle reference"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Document Type</label>
                <select
                  className="premium-input"
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">Select document type...</option>
                  <option value="VEHICLE_LICENSE">Vehicle License</option>
                  <option value="ROAD_WORTHINESS">Road Worthiness</option>
                  <option value="INSURANCE">Insurance</option>
                  <option value="PROOF_OF_OWNERSHIP">Proof of Ownership</option>
                  <option value="HACKNEY_PERMIT">Hackney Permit</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Reference Number / Certificate ID</label>
                <input
                  className="premium-input"
                  name="documentReferenceNumber"
                  value={form.documentReferenceNumber}
                  onChange={handleChange}
                  placeholder="e.g. V-12345678"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Issuing Authority</label>
                <input
                  className="premium-input"
                  name="issuingAuthority"
                  value={form.issuingAuthority}
                  onChange={handleChange}
                  placeholder="e.g. FRSC / VIO"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Issued Date</label>
                  <input
                    type="date"
                    className="premium-input"
                    name="issuedDate"
                    value={form.issuedDate}
                    onChange={handleChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Expiry Date</label>
                  <input
                    type="date"
                    className="premium-input"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button className="premium-btn" type="submit" disabled={loading} style={{ flex: 2, padding: '14px' }}>
                  {loading ? 'Processing...' : 'Upload Document'}
                </button>
                <button className="premium-btn" type="button" onClick={() => navigate('/driver')} style={{ background: '#f1f5f9', color: 'var(--text-secondary)', flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  )
}
