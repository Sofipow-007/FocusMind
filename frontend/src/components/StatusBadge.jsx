import styles from './StatusBadge.module.css'

const TONES = {
  completada: 'success',
  racha: 'success',
  examen: 'alert',
  planificada: 'neutral',
  cancelada: 'neutral',
  pendiente: 'alert',
  respondida: 'success',
}

function StatusBadge({ label, tone }) {
  const resolvedTone = TONES[tone] || tone || 'neutral'
  return <span className={`${styles.badge} ${styles[resolvedTone]}`}>{label}</span>
}

export default StatusBadge
