import { useCallback, useEffect, useState } from 'react'

import AppLayout from './components/AppLayout'
import Button from './components/Button'
import InlineMessage from './components/InlineMessage'
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
  const [sessionError, setSessionError] = useState('')
  const [logoutError, setLogoutError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const restoreSession = useCallback(async () => {
    setSessionStatus('loading')
    setSessionError('')
    try {
      const data = await getMe()
      setUser(data.user)
      setSessionStatus('authenticated')
    } catch (error) {
      if (error.status === 401) {
        setUser(null)
        setSessionStatus('anonymous')
        return
      }
      setSessionError(error.message)
      setSessionStatus('error')
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    getMe()
      .then((data) => {
        if (!isMounted) return
        setUser(data.user)
        setSessionStatus('authenticated')
      })
      .catch((error) => {
        if (!isMounted) return
        if (error.status === 401) {
          setUser(null)
          setSessionStatus('anonymous')
          return
        }
        setSessionError(error.message)
        setSessionStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogout() {
    setIsLoggingOut(true)
    setLogoutError('')
    try {
      await logout()
      setUser(null)
      setCurrentView('dashboard')
      setSessionStatus('anonymous')
    } catch (error) {
      setLogoutError(error.message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (sessionStatus === 'loading') {
    return (
      <main style={{ padding: '2rem' }}>
        <LoadingState label="Comprobando sesión..." />
      </main>
    )
  }

  if (sessionStatus === 'error') {
    return (
      <main className="stack" style={{ padding: '2rem' }}>
        <InlineMessage>{`No se pudo comprobar la sesión: ${sessionError}`}</InlineMessage>
        <Button onClick={restoreSession}>Reintentar</Button>
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
      logoutError={logoutError}
      isLoggingOut={isLoggingOut}
    >
      {views[currentView]}
    </AppLayout>
  )
}

export default App
