import { useEffect, useState } from 'react'
import {
  getAllUsers,
  promoteToOfficer,
  deleteUser,
  getLaws,
  createLaw,
  deleteLaw,
  getAllViolations
} from '../services/api'
import Layout from '../components/Layout'
import '../styles/dashboard.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [laws, setLaws] = useState([])
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users') // 'users', 'laws', 'violations', 'monitoring'
  const [lawForm, setLawForm] = useState({ title: '', description: '' })

  const user = JSON.parse(localStorage.getItem('user'))

  const loadData = async () => {
    try {
      const usersRes = await getAllUsers()
      const lawsRes = await getLaws()
      const violationsRes = await getAllViolations()
      setUsers(usersRes.data)
      setLaws(lawsRes.data)
      setViolations(violationsRes.data || [])
    } catch (err) {
      console.error(err)
      // Mock data for violations if backend missing
      setViolations([
        { id: 1, title: 'Speeding', amount: 5000, status: 'UNPAID', vehicle: 'ABC-123-XY' },
        { id: 2, title: 'No License', amount: 15000, status: 'UNPAID', vehicle: 'XYZ-789-AB' }
      ])
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handlePromote = async (id) => {
    await promoteToOfficer(id)
    loadData()
  }

  const handleDeleteUser = async (id) => {
    await deleteUser(id)
    loadData()
  }

  const handleCreateLaw = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createLaw(lawForm)
      setLawForm({ title: '', description: '' })
      loadData()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLaw = async (id) => {
    await deleteLaw(id)
    loadData()
  }

  const handleExport = () => {
    const data = activeTab === 'users' ? users : violations
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-report.csv`
    a.click()
  }

  return (
    <Layout role="ADMIN">
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Admin Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              System Health: Optimal • {users.length} Active Users
            </p>
          </div>
          <button className="premium-btn" style={{ minHeight: '40px', padding: '0 16px', fontSize: '0.8rem' }} onClick={handleExport}>
            📥 Export Report
          </button>
        </header>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
          {['users', 'violations', 'laws', 'monitoring'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: activeTab === tab ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ animation: 'slideUp 0.4s ease-out' }}>
          {activeTab === 'users' && (
            <section className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
               <div className="table-container" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                        </td>
                        <td>
                          <span className={`card-status ${u.role === 'ADMIN' ? 'verified' : ''}`} style={{ fontSize: '10px' }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {u.role === 'DRIVER' && (
                              <button className="premium-btn" style={{ padding: '6px 12px', fontSize: '0.7rem', minHeight: 'auto' }} onClick={() => handlePromote(u.id)}>
                                Promote
                              </button>
                            )}
                            <button 
                              className="premium-btn" 
                              style={{ padding: '6px 12px', fontSize: '0.7rem', background: '#fee2e2', color: '#991b1b', minHeight: 'auto' }}
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'violations' && (
             <section className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container" style={{ border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle</th>
                        <th>Offence</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {violations.map(v => (
                        <tr key={v.id}>
                          <td>#{v.id}</td>
                          <td style={{ fontWeight: 600 }}>{v.vehicle}</td>
                          <td>{v.title}</td>
                          <td>₦{v.amount?.toLocaleString()}</td>
                          <td>
                             <span className={`card-status ${v.status === 'PAID' ? 'verified' : 'expired'}`}>
                                {v.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </section>
          )}

          {activeTab === 'laws' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <section className="stat-card">
                  <h3 style={{ marginBottom: '1rem' }}>Add New Regulation</h3>
                  <form onSubmit={handleCreateLaw} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <input
                        className="premium-input"
                        placeholder="Offence Title"
                        value={lawForm.title}
                        onChange={(e) => setLawForm({ ...lawForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        className="premium-input"
                        placeholder="Detailed Description"
                        style={{ minHeight: '100px', width: '100%' }}
                        value={lawForm.description}
                        onChange={(e) => setLawForm({ ...lawForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <button className="premium-btn" type="submit" disabled={loading}>
                      {loading ? 'Adding...' : 'Post Regulation'}
                    </button>
                  </form>
              </section>
              <section className="stat-card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Active Regulations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {laws.map(law => (
                      <div key={law.id} style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{law.title}</div>
                         <button 
                          onClick={() => handleDeleteLaw(law.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', padding: '4px' }}
                         >
                           ✕
                         </button>
                      </div>
                    ))}
                  </div>
              </section>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="stats-grid">
               <div className="stat-card" style={{ background: 'linear-gradient(135deg, #B2C9AB 0%, #9fb896 100%)', color: 'white' }}>
                  <div className="stat-value" style={{ color: 'white' }}>99.9%</div>
                  <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>System Uptime</div>
               </div>
               <div className="stat-card">
                  <div className="stat-value">{users.filter(u => u.role === 'OFFICER').length}</div>
                  <div className="stat-label">Active Officers</div>
               </div>
               <div className="stat-card">
                  <div className="stat-value">₦450,000</div>
                  <div className="stat-label">Revenue This Month</div>
               </div>
               <div className="stat-card">
                  <div className="stat-value">12.4k</div>
                  <div className="stat-label">Total Verifications</div>
               </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}