import '../styles/info.css'

const laws = [
  {
    title: 'Who can stop you?',
    content: 'FRSC, Police, VIO, and other authorized agencies.'
  },
  {
    title: 'When can they stop you?',
    content: 'During routine checks, traffic violations, or security operations.'
  },
  {
    title: 'Your rights',
    content: 'You have the right to be treated respectfully and not be harassed.'
  },
  {
    title: 'Document checks',
    content: 'You are required to present valid vehicle and driver documents when requested.'
  },
]

export default function Laws() {
  return (
    <div className="info-page">
      <h2>Road Laws & Your Rights</h2>

      <div className="info-grid">
        {laws.map((l, i) => (
          <div key={i} className="info-card">
            <h4>{l.title}</h4>
            <p>{l.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}