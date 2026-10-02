import styles from './TextField.module.css'

function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required,
  autoComplete,
  min,
  rows,
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>{label}</label>
      {rows ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          min={min}
        />
      )}
    </div>
  )
}

export default TextField
