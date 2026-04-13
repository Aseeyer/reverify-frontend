import { useState } from 'react'
import { registerUser } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '',
    email: '', phoneNumber: '', nin: '', password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>reVerify</h2>
        <p style={styles.subtitle}>Create your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input style={{...styles.input, marginRight: '0.5rem'}} name="firstName"
              placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            <input style={styles.input} name="lastName"
              placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          </div>
          <input style={styles.input} name="username"
            placeholder="Username" value={form.username} onChange={handleChange} required />
          <input style={styles.input} name="email" type="email"
            placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="phoneNumber"
            placeholder="Phone Number e.g +2348012345678" value={form.phoneNumber} onChange={handleChange} required />
          <input style={styles.input} name="nin"
            placeholder="NIN (11 digits)" value={form.nin} onChange={handleChange} required />
          <input style={styles.input} name="password" type="password"
            placeholder="Password" value={form.password} onChange={handleChange} required />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0f172a'
  },
  card: {
    backgroundColor: '#1e293b', padding: '2.5rem',
    borderRadius: '12px', width: '100%', maxWidth: '440px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  },
  title: { color: '#38bdf8', fontSize: '1.8rem', marginBottom: '0.25rem', textAlign: 'center' },
  subtitle: { color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' },
  row: { display: 'flex' },
  input: {
    width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem',
    borderRadius: '8px', border: '1px solid #334155',
    backgroundColor: '#0f172a', color: '#f1f5f9',
    fontSize: '0.95rem', boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: '0.85rem', backgroundColor: '#38bdf8',
    color: '#0f172a', border: 'none', borderRadius: '8px',
    fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem'
  },
  error: { color: '#f87171', marginBottom: '1rem', textAlign: 'center' },
  link: { color: '#94a3b8', textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem' }
}