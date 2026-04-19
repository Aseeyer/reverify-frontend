import '../styles/info.css'

const violations = [
  {
    title: 'Driving without valid license',
    penalty: 'Fine + possible vehicle impoundment'
  },
  {
    title: 'Expired vehicle documents',
    penalty: 'Fine and possible seizure'
  },
  {
    title: 'Over-speeding',
    penalty: 'Fine and possible court prosecution'
  },
  {
    title: 'Driving against traffic',
    penalty: 'Heavy fine + license suspension'
  },
  {
    title: 'Use of phone while driving',
    penalty: 'Fine'
  },
  {
    title: 'Seatbelt violation',
    penalty: 'Fine'
  },
]

export default function Violations() {
  return (
    <div className="info-page">
      <h2>Road Violations & Penalties</h2>

      <div className="info-grid">
        {violations.map((v, i) => (
          <div key={i} className="info-card">
            <h4>{v.title}</h4>
            <p>{v.penalty}</p>
          </div>
        ))}
      </div>
    </div>
  )
}