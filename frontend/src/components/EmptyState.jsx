function EmptyState({ title, children }) {
  return (
    <div className="card">
      <h3 className="section-title">{title}</h3>
      <div>{children}</div>
    </div>
  )
}

export default EmptyState
