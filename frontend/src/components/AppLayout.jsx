import Button from './Button'
import styles from './AppLayout.module.css'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'subjects', label: 'Materias' },
  { id: 'sessions', label: 'Sesiones' },
  { id: 'notes', label: 'Notas' },
  { id: 'calendar', label: 'Calendario' },
]

function AppLayout({ user, currentView, onNavigate, onLogout, children }) {
  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <aside className={styles.sidebar}>
        <p className={styles.brand}>FocusMind</p>
        <p className="muted">{user?.nombre}</p>
        <nav aria-label="Principal">
          <ul className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={currentView === item.id ? styles.active : styles.link}
                  aria-current={currentView === item.id ? 'page' : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <Button variant="secondary" onClick={onLogout}>Cerrar sesión</Button>
      </aside>
      <main id="contenido" className={styles.content}>
        {children}
      </main>
    </div>
  )
}

export default AppLayout
