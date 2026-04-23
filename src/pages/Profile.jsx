import { useState } from 'react'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import '../styles/dashboard.css'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    nin: user?.nin || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Profile updated successfully')
      setLoading(false)
    }, 1000)
  }

  return (
    <Layout role={user?.role}>
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            My Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage your personal information and identity credentials.
          </p>
        </header>

        <div className="stat-card" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>First Name</label>
                <input 
                  className="premium-input" 
                  value={form.firstName} 
                  onChange={(e) => setForm({...form, firstName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Last Name</label>
                <input 
                  className="premium-input" 
                  value={form.lastName} 
                  onChange={(e) => setForm({...form, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Email Address</label>
              <input 
                className="premium-input" 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Phone Number</label>
              <input 
                className="premium-input" 
                value={form.phoneNumber} 
                onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>National Identity Number (NIN)</label>
              <input 
                className="premium-input" 
                value={form.nin} 
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-muted)' }}>NIN cannot be changed once verified.</small>
            </div>

            <button className="premium-btn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
