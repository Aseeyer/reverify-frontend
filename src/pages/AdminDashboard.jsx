import { useEffect, useState } from 'react'
import {
  getAllUsers,
  promoteToOfficer,
  deleteUser,
  getLaws,
  createLaw,
  deleteLaw
} from '../services/api'
import '../styles/admin.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [laws, setLaws] = useState([])
  const [loading, setLoading] = useState(false)

  const [lawForm, setLawForm] = useState({
    title: '',
    description: ''
  })

  const loadData = async () => {
    try {
      const usersRes = await getAllUsers()
      const lawsRes = await getLaws()

      setUsers(usersRes.data)
      setLaws(lawsRes.data)
    } catch (err) {
      console.error(err)
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

  const handleLawChange = (e) => {
    setLawForm({ ...lawForm, [e.target.name]: e.target.value })
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

  return (
    <div className="admin-container">

      <h1>👑 Admin Dashboard 👑</h1>
      

      <section>
        <h2>👤 Users & Officers</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>

                <td>
                  {u.role === 'DRIVER' && (
                    <button onClick={() => handlePromote(u.id)}>
                      Promote
                    </button>
                  )}

                  <button onClick={() => handleDeleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= LAWS ================= */}
      <section>
        <h2>📜 Traffic Laws</h2>

        <form onSubmit={handleCreateLaw}>
          <input
            name="title"
            placeholder="Law title"
            value={lawForm.title}
            onChange={handleLawChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={lawForm.description}
            onChange={handleLawChange}
            required
          />

          <button type="submit" disabled={loading}>
            Add Law
          </button>
        </form>

        <ul>
          {laws.map((law) => (
            <li key={law.id}>
              <strong>{law.title}</strong> - {law.description}

              <button onClick={() => handleDeleteLaw(law.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

    </div>
  )
}