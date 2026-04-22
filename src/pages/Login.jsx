import { useState } from 'react'
import { loginUser } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/login.css'
import bgVideo from '../assets/Driver_showing_phone.mp4'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginUser(form)

      const user = response.data.user

localStorage.setItem('token', response.data.access_token)
localStorage.setItem('user', JSON.stringify(user))

if (user.role === 'ADMIN') navigate('/admin')
else if (user.role === 'OFFICER') navigate('/officer')
else navigate('/driver')

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <video autoPlay muted loop playsInline className="bg-video">
      <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="auth-card">
        <div className="auth-logo">
          <h1>reVerify</h1>
          <span>Road Document Verification</span>
        </div>
        <p className="auth-title">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" name="email" type="email"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" name="password" type="password"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}