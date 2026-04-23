import { useEffect, useState } from 'react'
import { getViolations, payViolation } from '../services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import '../styles/dashboard.css'

export default function Violations() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadViolations()
  }, [])

  const loadViolations = async () => {
    try {
      const res = await getViolations()
      setViolations(res.data)
    } catch (err) {
      console.error(err)
      // Mock data for demo if backend fails
      setViolations([
        { id: 1, title: 'Speeding', amount: 5000, status: 'UNPAID', date: '2023-10-20' },
        { id: 2, title: 'Expired License', amount: 10000, status: 'PAID', date: '2023-09-15' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async (id) => {
    try {
      await payViolation(id)
      toast.success('Fine paid successfully')
      loadViolations()
    } catch (err) {
      toast.error('Payment failed')
    }
  }

  return (
    <Layout role={user?.role}>
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            My Violations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review and settle any outstanding road penalties.
          </p>
        </header>

        <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Offence</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {violations.length > 0 ? violations.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ref: #{v.id}00X</div>
                    </td>
                    <td>{v.date}</td>
                    <td>₦{v.amount?.toLocaleString()}</td>
                    <td>
                      <span className={`card-status ${v.status === 'PAID' ? 'verified' : 'expired'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      {v.status === 'UNPAID' && (
                        <button className="premium-btn" style={{ padding: '6px 12px', fontSize: '0.7rem', minHeight: 'auto' }} onClick={() => handlePay(v.id)}>
                          Pay Fine
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No violations found. Drive safe!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}