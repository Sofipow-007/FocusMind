import { useEffect, useState } from 'react'

import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import InlineMessage from '../components/InlineMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import SelectField from '../components/SelectField'
import StatusBadge from '../components/StatusBadge'
import TextField from '../components/TextField'
import { createExam, deleteExam, getExams, updateExam } from '../services/examService'
import { getSubjects } from '../services/subjectService'
import { getStudySessions } from '../services/studySessionService'
import { getCalendarWeek, toLocalDateIso } from '../utils/calendar'
import { formatDateTime, fromDateTimeLocalValue, toDateTimeLocalValue } from '../utils/dates'
import { subjectNameById } from '../utils/labels'

const EMPTY_FORM = { materiaId: '', titulo: '', fecha: '', descripcion: '' }

function CalendarPage({ onNavigate }) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [sessions, setSessions] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    const [subjectsResult, examsResult, sessionsResult] = await Promise.all([
      getSubjects(),
      getExams(),
      getStudySessions(),
    ])
    setSubjects(subjectsResult)
    setExams(examsResult)
    setSessions(sessionsResult)
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([getSubjects(), getExams(), getStudySessions()])
      .then(([subjectsResult, examsResult, sessionsResult]) => {
        if (!isMounted) return
        setSubjects(subjectsResult)
        setExams(examsResult)
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

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setFeedback(null)
    if (subjects.length === 0) {
      setFormError('Creá una materia antes de cargar un examen.')
      return
    }
    setIsSaving(true)
    const examPayload = {
      titulo: form.titulo,
      fecha: fromDateTimeLocalValue(form.fecha),
    }
    if (form.descripcion.trim()) examPayload.descripcion = form.descripcion.trim()

    let actionMessage
    try {
      if (editingId) {
        await updateExam(editingId, examPayload)
        actionMessage = 'Examen actualizado correctamente.'
      } else {
        await createExam({ ...examPayload, materiaId: Number(form.materiaId) })
        actionMessage = 'Examen creado correctamente.'
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
    } catch (saveError) {
      setFormError(saveError.message)
      setIsSaving(false)
      return
    }

    try {
      await load()
      setFeedback({ tone: 'success', message: actionMessage })
    } catch (loadError) {
      setFeedback({ tone: 'error', message: `${actionMessage} No se pudo actualizar el calendario: ${loadError.message}` })
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading') return <LoadingState label="Cargando calendario..." />
  if (status === 'error') return <InlineMessage>{error}</InlineMessage>

  const scheduledSubjects = subjects.filter((subject) => subject.diaEstudio)
  const weekDays = getCalendarWeek({ sessions, exams })
  const hasWeekEvents = weekDays.some((day) => day.sessions.length > 0 || day.exams.length > 0)

  return (
    <div className="stack-lg">
      <PageHeader title="Calendario" />
      {feedback ? <InlineMessage tone={feedback.tone}>{feedback.message}</InlineMessage> : null}

      <section className="stack">
        <h2 className="section-title">Semana de estudio</h2>
        {scheduledSubjects.length === 0 && !hasWeekEvents ? (
          <EmptyState title="La semana está vacía">
            Definí un bloque en Materias, planificá una sesión o cargá un examen debajo.
            <Button variant="secondary" onClick={() => onNavigate('subjects')}>Ir a materias</Button>
          </EmptyState>
        ) : (
          <div className="week-grid">
            {weekDays.map((day) => (
              <section key={day.weekday} className="week-day">
                <h3>
                  {day.weekday[0].toUpperCase() + day.weekday.slice(1)}{' '}
                  <time dateTime={toLocalDateIso(day.date)}>
                    {day.date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  </time>
                </h3>
                {subjects.filter((subject) => subject.diaEstudio === day.weekday).map((subject) => (
                  <p key={`s-${subject.id}`} className="block-chip">
                    {subject.nombre}<br />
                    {subject.horaInicio || ''}–{subject.horaFin || ''}
                  </p>
                ))}
                {day.sessions.map((session) => (
                  <p key={`planned-${session.id}`} className="session-chip">
                    Sesión planificada<br />
                    {subjectNameById(subjects, session.materiaId)}<br />
                    {formatDateTime(session.fecha)} · {session.duracion} min
                  </p>
                ))}
                {day.exams.map((exam) => (
                  <p key={`e-${exam.id}`} className="exam-chip">
                    {exam.titulo}<br />
                    {subjectNameById(subjects, exam.materiaId)}<br />
                    {formatDateTime(exam.fecha)}
                  </p>
                ))}
              </section>
            ))}
          </div>
        )}
      </section>

      <section className="card stack">
        <h2 className="section-title">Gestión de exámenes</h2>
        {subjects.length === 0 ? (
          <EmptyState title="Necesitás una materia">
            <Button onClick={() => onNavigate('subjects')}>Ir a materias</Button>
          </EmptyState>
        ) : (
          <form className="form-grid" onSubmit={handleSubmit}>
            <SelectField label="Materia" value={form.materiaId} onChange={(event) => setForm({ ...form, materiaId: event.target.value })} required={!editingId}>
              <option value="">Elegí una materia</option>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.nombre}</option>)}
            </SelectField>
            <TextField label="Título" value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} required />
            <TextField label="Fecha" type="datetime-local" value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })} required />
            <TextField label="Descripción" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
            <InlineMessage>{formError}</InlineMessage>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar examen'}</Button>
          </form>
        )}

        {exams.length === 0 ? (
          <EmptyState title="No hay exámenes">Los próximos aparecerán también en el inicio.</EmptyState>
        ) : (
          <ul className="list">
            {exams.map((exam) => (
              <li key={exam.id} className="row">
                <StatusBadge label="Examen" tone="examen" />
                <span>{exam.titulo}</span>
                <span className="muted">{subjectNameById(subjects, exam.materiaId)}</span>
                <span>{formatDateTime(exam.fecha)}</span>
                <Button variant="secondary" onClick={() => {
                  setEditingId(exam.id)
                  setForm({
                    materiaId: String(exam.materiaId),
                    titulo: exam.titulo,
                    fecha: toDateTimeLocalValue(exam.fecha),
                    descripcion: exam.descripcion || '',
                  })
                }}>Editar</Button>
                <Button variant="secondary" disabled={deletingId === exam.id} onClick={async () => {
                  setFeedback(null)
                  setDeletingId(exam.id)
                  try {
                    await deleteExam(exam.id)
                  } catch (deleteError) {
                    setFeedback({ tone: 'error', message: deleteError.message })
                    setDeletingId(null)
                    return
                  }
                  try {
                    await load()
                    setFeedback({ tone: 'success', message: 'Examen eliminado correctamente.' })
                  } catch (loadError) {
                    setFeedback({ tone: 'error', message: `Examen eliminado, pero no se pudo actualizar la lista: ${loadError.message}` })
                  } finally {
                    setDeletingId(null)
                  }
                }}>{deletingId === exam.id ? 'Eliminando...' : 'Eliminar'}</Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default CalendarPage
