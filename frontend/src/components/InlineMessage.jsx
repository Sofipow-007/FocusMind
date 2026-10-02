import styles from './InlineMessage.module.css'

function InlineMessage({ children, tone = 'error' }) {
  if (!children) return null

  return (
    <p className={`${styles.message} ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}

export default InlineMessage
