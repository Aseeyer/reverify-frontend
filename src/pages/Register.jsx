import { useState } from 'react'
import { registerUser, verifyNINExternal } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/login.css'
import '../styles/register.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '',
    email: '', phoneNumber: '', nin: '', password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyingNIN, setVerifyingNIN] = useState(false)
  const [ninVerified, setNinVerified] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerUser(form)
      navigate('/')
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyNIN = async () => {
    if (form.nin.length !== 11) {
      setError('NIN must be 11 digits')
      return
    }
    setVerifyingNIN(true)
    setError('')
    try {
      const res = await verifyNINExternal(form.nin)
      // If successful, we might get back user data
      if (res.data?.status === 'success' || res.data?.data) {
        const data = res.data.data
        setForm({
          ...form,
          firstName: data.firstName || form.firstName,
          lastName: data.lastName || form.lastName,
        })
        setNinVerified(true)
        setError('')
      }
    } catch (err) {
      setError('Could not verify NIN. Please check the number and try again.')
    } finally {
      setVerifyingNIN(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <h1>reVerify</h1>
          <span>Road Document Verification</span>
        </div>
        <p className="auth-title">Create your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input className="form-input" name="firstName" placeholder="Enter your first name"
                value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input className="form-input" name="lastName" placeholder="Enter your last name"
                value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" name="username" placeholder="Enter a username"
              value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" name="email" type="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-input" name="phoneNumber" placeholder="+2348012345678"
              value={form.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>NIN (11 Digits)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                className="form-input" 
                name="nin" 
                placeholder="11-digit NIN"
                value={form.nin} 
                onChange={handleChange} 
                required 
                disabled={ninVerified}
              />
              <button 
                type="button" 
                className="btn-verify" 
                onClick={handleVerifyNIN}
                disabled={verifyingNIN || ninVerified || form.nin.length !== 11}
                style={{
                  background: ninVerified ? '#10b981' : 'var(--accent-green)',
                  color: 'white',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  minWidth: '80px'
                }}
              >
                {verifyingNIN ? '...' : ninVerified ? '✓' : 'Verify'}
              </button>
            </div>
            {ninVerified && <small style={{ color: '#10b981', marginTop: '4px', display: 'block' }}>NIN Identity Verified</small>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" name="password" type="password"
              placeholder="••••••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  )
}