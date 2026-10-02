import { useEffect, useState } from 'react'

import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import InlineMessage from '../components/InlineMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import SelectField from '../components/SelectField'
import StatusBadge from '../components/StatusBadge'
import TextField from '../components/TextField'
import { createStudySession, deleteStudySession, getStudySessions, updateStudySession } from '../services/studySessionService'
import { getSubjects } from '../services/subjectService'
import { formatDateTime, fromDateTimeLocalValue, toDateTimeLocalValue } from '../utils/dates'
import { SESSION_STATES, subjectNameById } from '../utils/labels'

const EMPTY_FORM = { materiaId: '', fecha: '', duracion: '', descripcion: '', estado: 'planificada' }

function StudySessionsPage({ onNavigate }) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  async function load(materiaId = filter) {
    const [subjectsResult, sessionsResult] = await Promise.all([
      getSubjects(),
      getStudySessions(materiaId || undefined),
    ])
    setSubjects(subjectsResult)
    setSessions(sessionsResult)
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([getSubjects(), getStudySessions()])
      .then(([subjectsResult, sessionsResult]) => {
        if (!isMounted) return
        setSubjects(subjectsResult)
        setSessions(sessionsResult)
        setStatus('ready')
      })
      .catch((loadError) => {
        if (!isMounted) return
        setError(loadError.message)
        setStatus('error')
      })
    return () => { isMounted = false }
  }, [])

  async function handleFilterChange(event) {
    const value = event.target.value
    setFilter(value)
    setStatus('loading')
    try {
      await load(value)
      setStatus('ready')
    } catch (loadError) {
      setError(loadError.message)
      setStatus('error')
    }
  }

  function startEdit(session) {
    setEditingId(session.id)
    setForm({
      materiaId: String(session.materiaId),
      fecha: toDateTimeLocalValue(session.fecha),
      duracion: String(session.duracion),
      descripcion: session.descripcion || '',
      estado: session.estado,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (subjects.length === 0) {
      setFormError('Creá una materia antes de registrar una sesión.')
      return
    }
    setIsSaving(true)
    const payload = {
      materiaId: Number(form.materiaId),
      fecha: fromDateTimeLocalValue(form.fecha),
      duracion: Number(form.duracion),
      estado: form.estado,
    }
    if (form.descripcion.trim()) payload.descripcion = form.descripcion.trim()

    try {
      if (editingId) {
        const { materiaId, ...updatePayload } = payload
        await updateStudySession(editingId, updatePayload)
      } else {
        await createStudySession(payload)
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      await load()
    } catch (saveError) {
      setFormError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading') return <LoadingState label="Cargando sesiones..." />
  if (status === 'error') return <InlineMessage>{error}</InlineMessage>

  return (
    <div className="stack-lg">
      <PageHeader title="Sesiones de estudio" />

      {subjects.length === 0 ? (
        <EmptyState title="Necesitás una materia">
          <Button onClick={() => onNavigate('subjects')}>Ir a materias</Button>
        </EmptyState>
      ) : (
        <form className="card form-grid" onSubmit={handleSubmit}>
          <h2 className="section-title">{editingId ? 'Editar sesión' : 'Nueva sesión'}</h2>
          <SelectField label="Materia" value={form.materiaId} onChange={(event) => setForm({ ...form, materiaId: event.target.value })} required>
            <option value="">Elegí una materia</option>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.nombre}</option>)}
          </SelectField>
          <TextField label="Fecha y hora" type="datetime-local" value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })} required />
          <TextField label="Duración (minutos)" type="number" min="1" value={form.duracion} onChange={(event) => setForm({ ...form, duracion: event.target.value })} required />
          <TextField label="Descripción" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
          <SelectField label="Estado" value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })}>
            {SESSION_STATES.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
          </SelectField>
          <InlineMessage>{formError}</InlineMessage>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
        </form>
      )}

      <SelectField label="Filtrar por materia" value={filter} onChange={handleFilterChange}>
        <option value="">Todas</option>
        {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.nombre}</option>)}
      </SelectField>

      {sessions.length === 0 ? (
        <EmptyState title="No hay sesiones">Registrá tu primera sesión de estudio.</EmptyState>
      ) : (
        <ul className="list">
          {sessions.map((session) => (
            <li key={session.id} className="card row">
              <div>
                <p><strong>{subjectNameById(subjects, session.materiaId)}</strong></p>
                <p>{formatDateTime(session.fecha)} · {session.duracion} min</p>
                {session.descripcion ? <p>{session.descripcion}</p> : null}
              </div>
              <StatusBadge label={session.estado} tone={session.estado} />
              <Button variant="secondary" onClick={() => startEdit(session)}>Editar</Button>
              <Button variant="secondary" onClick={async () => {
                await deleteStudySession(session.id)
                await load()
              }}>Eliminar</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudySessionsPage
