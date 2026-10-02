import StatusBadge from './StatusBadge'
import styles from './SubjectCard.module.css'

function SubjectCard({ subject, actions }) {
  return (
    <article className={`card ${styles.card}`}>
      <div>
        <h3 className="section-title">{subject.nombre}</h3>
        <p className="muted">
          {subject.diaEstudio
            ? `${subject.diaEstudio} ${subject.horaInicio || ''}–${subject.horaFin || ''}`
            : 'Sin bloque semanal'}
        </p>
        <div className="row">
          {subject.favorita ? <StatusBadge label="Favorita" tone="neutral" /> : null}
          {subject.prioritaria ? <StatusBadge label="Prioritaria" tone="alert" /> : null}
        </div>
      </div>
      {actions}
    </article>
  )
}

export default SubjectCard
