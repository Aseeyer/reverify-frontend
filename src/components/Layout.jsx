import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import '../styles/dashboard.css'

export default function Layout({ children, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const navItems = {
    DRIVER: [
      { path: '/driver', label: 'Dashboard', icon: '📊' },
      { path: '/register-vehicle', label: 'My Vehicles', icon: '🚗' },
      { path: '/violations', label: 'Violations', icon: '⚖️' },
      { path: '/laws', label: 'Traffic Laws', icon: '📖' },
      { path: '/profile', label: 'My Profile', icon: '👤' },
    ],
    OFFICER: [
      { path: '/officer', label: 'Inspection', icon: '🔍' },
      { path: '/history', label: 'History', icon: '📜' },
      { path: '/laws', label: 'Regulations', icon: '📖' },
    ],
    ADMIN: [
      { path: '/admin', label: 'Console', icon: '⚙️' },
      { path: '/admin/users', label: 'Users', icon: '👥' },
      { path: '/admin/violations', label: 'All Violations', icon: '⚖️' },
      { path: '/laws', label: 'Manage Laws', icon: '📖' },
    ]
  }

  const currentNav = navItems[role] || []

  return (
    <div className="dashboard-container">
      {/* MOBILE HEADER */}
      <div className="mobile-header">
        <div className="sidebar-logo" style={{ marginBottom: 0, padding: 0 }}>
          <img src={logo} alt="reVerify" style={{ width: '28px', borderRadius: '4px' }} />
          <span>re<span>Verify</span></span>
        </div>
        <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {/* SIDEBAR OVERLAY */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="reVerify" style={{ width: '32px', borderRadius: '4px' }} />
          <span>re<span>Verify</span></span>
        </div>

        <nav className="sidebar-nav">
          {currentNav.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info" style={{ padding: '0 1rem 1rem', fontSize: '0.85rem' }}>
            <div style={{ color: 'white', fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ color: 'var(--text-secondary)' }}>{role}</div>
          </div>
          <button className="nav-item" onClick={handleLogout}>
             <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
