function PageHeader({ title, children }) {
  return (
    <header className="row">
      <h1 className="page-title">{title}</h1>
      <div className="row">{children}</div>
    </header>
  )
}

export default PageHeader
