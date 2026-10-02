import styles from './Button.module.css'

function Button({ children, variant = 'primary', type = 'button', disabled, onClick }) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
