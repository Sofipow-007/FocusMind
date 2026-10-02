import { useEffect, useState } from 'react'

import AppLayout from './components/AppLayout'
import LoadingState from './components/LoadingState'
import AuthPage from './pages/AuthPage'
import CalendarPage from './pages/CalendarPage'
import DashboardPage from './pages/DashboardPage'
import NotesPage from './pages/NotesPage'
import StudySessionsPage from './pages/StudySessionsPage'
import SubjectsPage from './pages/SubjectsPage'
import { getMe, logout } from './services/authService'

function App() {
  const [sessionStatus, setSessionStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('dashboard')

  useEffect(() => {
    let isMounted = true

    getMe()
      .then((data) => {
        if (!isMounted) return
        setUser(data.user)
        setSessionStatus('authenticated')
      })
      .catch(() => {
        if (!isMounted) return
        setUser(null)
        setSessionStatus('anonymous')
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // La cookie puede haber expirado; igual se vuelve a login.
    }
    setUser(null)
    setCurrentView('dashboard')
    setSessionStatus('anonymous')
  }

  if (sessionStatus === 'loading') {
    return (
      <main style={{ padding: '2rem' }}>
        <LoadingState label="Comprobando sesión..." />
      </main>
    )
  }

  if (sessionStatus === 'anonymous') {
    return <AuthPage onAuthenticated={(nextUser) => {
      setUser(nextUser)
      setCurrentView('dashboard')
      setSessionStatus('authenticated')
    }} />
  }

  const views = {
    dashboard: <DashboardPage user={user} onNavigate={setCurrentView} />,
    subjects: <SubjectsPage />,
    sessions: <StudySessionsPage onNavigate={setCurrentView} />,
    notes: <NotesPage onNavigate={setCurrentView} />,
    calendar: <CalendarPage onNavigate={setCurrentView} />,
  }

  return (
    <AppLayout
      user={user}
      currentView={currentView}
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    >
      {views[currentView]}
    </AppLayout>
  )
}

export default App
