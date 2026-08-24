import { useEffect, useState } from 'react'

import { getHealth } from './services/api'

function App() {
  const [connectionState, setConnectionState] = useState('loading')
  const [connectionMessage, setConnectionMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getHealth()
      .then((data) => {
        if (!isMounted) return

        setConnectionState('connected')
        setConnectionMessage(data.message)
      })
      .catch((error) => {
        if (!isMounted) return

        setConnectionState('error')
        setConnectionMessage(error.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const statusContent = {
    loading: {
      label: 'Conectando con la API',
      message: 'Verificando disponibilidad del backend...',
    },
    connected: {
      label: 'API conectada',
      message: connectionMessage,
    },
    error: {
      label: 'API no disponible',
      message: connectionMessage,
    },
  }[connectionState]

  return (
    <main>
      <h1>FocusMind</h1>
      <section className={`status status-${connectionState}`} aria-live="polite">
        <p className="status-label">{statusContent.label}</p>
        <p>{statusContent.message}</p>
      </section>
    </main>
  );
}

export default App;
