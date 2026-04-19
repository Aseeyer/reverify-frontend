import { useState } from 'react'
import { addDocument } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../styles/login.css'

export default function AddDocument() {
const navigate = useNavigate()

const [form, setForm] = useState({
vehicleId: '',
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

  toast.success('Document added successfully')
  navigate('/dashboard')

} catch (err) {
  const msg =
    err.response?.data?.details ||
    err.response?.data?.error ||
    'Failed to add document'

  toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
} finally {
  setLoading(false)
}


}

return ( <div className="auth-page"> <div className="auth-card register-card">

```
    <div className="auth-logo">
      <h1>reVerify</h1>
      <span>Add Document</span>
    </div>

    <form className="auth-form" onSubmit={handleSubmit}>

      <div className="form-group">
        <label>Vehicle ID</label>
        <input
          className="form-input"
          name="vehicleId"
          value={form.vehicleId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Document Type</label>
        <select
          className="form-input"
          name="documentType"
          value={form.documentType}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          <option value="VEHICLE_LICENSE">Vehicle License</option>
          <option value="ROAD_WORTHINESS">Road Worthiness</option>
          <option value="INSURANCE">Insurance</option>
          <option value="PROOF_OF_OWNERSHIP">Proof of Ownership</option>
          <option value="HACKNEY_PERMIT">Hackney Permit</option>
        </select>
      </div>

      <div className="form-group">
        <label>Reference Number</label>
        <input
          className="form-input"
          name="documentReferenceNumber"
          value={form.documentReferenceNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Issuing Authority</label>
        <input
          className="form-input"
          name="issuingAuthority"
          value={form.issuingAuthority}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Issued Date</label>
        <input
          type="datetime-local"
          className="form-input"
          name="issuedDate"
          value={form.issuedDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Expiry Date</label>
        <input
          type="datetime-local"
          className="form-input"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn-primary" disabled={loading}>
        {loading ? 'Adding...' : 'Add Document'}
      </button>

    </form>

  </div>
</div>
)
}
