import fieldStyles from './TextField.module.css'

function SelectField({ id, label, value, onChange, children, required }) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={fieldStyles.field}>
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} value={value} onChange={onChange} required={required}>
        {children}
      </select>
    </div>
  )
}

export default SelectField
