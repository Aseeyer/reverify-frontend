import { useState } from 'react'
import { registerUser } from '../services/api'
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
              <input className="form-input" name="firstName" placeholder="John"
                value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input className="form-input" name="lastName" placeholder="Doe"
                value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" name="username" placeholder="johndoe"
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
            <label>NIN</label>
            <input className="form-input" name="nin" placeholder="11-digit NIN"
              value={form.nin} onChange={handleChange} required />
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