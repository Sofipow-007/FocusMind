import { useState } from 'react'

import Button from '../components/Button'
import InlineMessage from '../components/InlineMessage'
import TextField from '../components/TextField'
import { login, register } from '../services/authService'
import styles from './AuthPage.module.css'

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = mode === 'login'
        ? await login(email, password)
        : await register(nombre, email, password)
      onAuthenticated(result.user)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={`card ${styles.panel}`}>
        <h1 className="page-title">FocusMind</h1>
        <p>Iniciá sesión o creá una cuenta para organizar tu estudio.</p>

        <div className="row" role="tablist" aria-label="Acceso">
          <Button variant={mode === 'login' ? 'primary' : 'secondary'} onClick={() => setMode('login')}>
            Iniciar sesión
          </Button>
          <Button variant={mode === 'register' ? 'primary' : 'secondary'} onClick={() => setMode('register')}>
            Crear cuenta
          </Button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
              autoComplete="name"
            />
          ) : null}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <InlineMessage>{error}</InlineMessage>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
          </Button>
        </form>
      </section>
    </main>
  )
}

export default AuthPage
