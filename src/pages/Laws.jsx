import { useState } from 'react'
import { getAllLaws } from '../services/api' // Assuming we add this or keep the static list
import Layout from '../components/Layout'
import '../styles/dashboard.css'

const roadOffences = [
  { code: 'SLV', offence: 'Speed Limit Violation', category: 'Speeding', fine: 'N3,000 - N10,000', penalty: '3 Points' },
  { code: 'DDV', offence: 'Dangerous Driving', category: 'Safety', fine: 'N50,000', penalty: '10 Points' },
  { code: 'DLV', offence: 'Driver’s Licence Violation', category: 'Administrative', fine: 'N10,000', penalty: '7 Points' },
  { code: 'SBV', offence: 'Seat Belt Violation', category: 'Safety', fine: 'N2,000', penalty: '2 Points' },
  { code: 'UPD', offence: 'Use of Phone while Driving', category: 'Safety', fine: 'N4,000', penalty: '4 Points' },
  { code: 'OVL', offence: 'Overloading', category: 'General', fine: 'N10,000', penalty: '3 Points' },
  { code: 'FEV', offence: 'Fire Extinguisher Violation', category: 'Safety', fine: 'N3,000', penalty: '2 Points' },
  { code: 'LSV', offence: 'Light/Sign Violation', category: 'Traffic', fine: 'N2,000', penalty: '2 Points' },
  { code: 'TIV', offence: 'Tyre Violation', category: 'Safety', fine: 'N3,000', penalty: '3 Points' },
  { code: 'WAV', offence: 'Wiper Violation', category: 'Safety', fine: 'N2,000', penalty: '1 Point' },
  { code: 'RTV', offence: 'Route Violation', category: 'Traffic', fine: 'N5,000', penalty: '5 Points' },
  { code: 'DUI', offence: 'Driving Under Alcohol/Drug Influence', category: 'Safety', fine: 'N5,000', penalty: '10 Points' },
]

export default function Laws() {
  const [searchTerm, setSearchTerm] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))
  
  const filteredOffences = roadOffences.filter(item => 
    item.offence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout role={user?.role}>
      <div className="content-wrapper">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Road Safety Laws
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Official database of traffic offences and fine schedules.
          </p>
        </header>

        {/* SEARCH BAR */}
        <div className="search-panel" style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            className="premium-input"
            placeholder="Search by offence, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* OFFENCES TABLE */}
        <div className="table-container" style={{ animation: 'slideUp 0.4s ease-out' }}>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Offence</th>
                <th>Category</th>
                <th>Fine</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffences.length > 0 ? (
                filteredOffences.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--accent-green)', background: 'var(--accent-green-soft)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {item.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.offence}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.category}</td>
                    <td style={{ fontWeight: 700 }}>{item.fine}</td>
                    <td>
                      <span className="card-status" style={{ background: '#f1f5f9', color: '#475569' }}>
                        {item.penalty}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No results found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DISCLAIMER */}
        <div className="stat-card" style={{ marginTop: '2.5rem', borderLeft: '6px solid #B2C9AB', background: 'white' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>⚠️ Important Notice</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            These fines are based on the latest FRSC (Establishment) Act and National Road Traffic Regulations. 
            Always consult official FRSC channels for the most current legal information.
          </p>
        </div>
      </div>
    </Layout>
  )
}