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
import { formatDateTime, fromDateTimeLocalValue, toDateTimeLocalValue, weekdayFromIso } from '../utils/dates'
import { subjectNameById, WEEKDAYS } from '../utils/labels'

const EMPTY_FORM = { materiaId: '', titulo: '', fecha: '', descripcion: '' }

function CalendarPage({ onNavigate }) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  async function load() {
    const [subjectsResult, examsResult] = await Promise.all([getSubjects(), getExams()])
    setSubjects(subjectsResult)
    setExams(examsResult)
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([getSubjects(), getExams()])
      .then(([subjectsResult, examsResult]) => {
        if (!isMounted) return
        setSubjects(subjectsResult)
        setExams(examsResult)
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
    if (subjects.length === 0) {
      setFormError('Creá una materia antes de cargar un examen.')
      return
    }
    setIsSaving(true)
    const payload = {
      materiaId: Number(form.materiaId),
      titulo: form.titulo,
      fecha: fromDateTimeLocalValue(form.fecha),
    }
    if (form.descripcion.trim()) payload.descripcion = form.descripcion.trim()

    try {
      if (editingId) {
        const { materiaId, ...updatePayload } = payload
        await updateExam(editingId, updatePayload)
      } else {
        await createExam(payload)
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

  if (status === 'loading') return <LoadingState label="Cargando calendario..." />
  if (status === 'error') return <InlineMessage>{error}</InlineMessage>

  const scheduledSubjects = subjects.filter((subject) => subject.diaEstudio)

  return (
    <div className="stack-lg">
      <PageHeader title="Calendario" />

      <section className="stack">
        <h2 className="section-title">Semana de estudio</h2>
        {scheduledSubjects.length === 0 && exams.length === 0 ? (
          <EmptyState title="La semana está vacía">
            Definí un bloque en Materias o cargá un examen debajo.
            <Button variant="secondary" onClick={() => onNavigate('subjects')}>Ir a materias</Button>
          </EmptyState>
        ) : (
          <div className="week-grid">
            {WEEKDAYS.map((day) => (
              <section key={day} className="week-day">
                <h3>{day}</h3>
                {subjects.filter((subject) => subject.diaEstudio === day).map((subject) => (
                  <p key={`s-${subject.id}`} className="block-chip">
                    {subject.nombre}<br />
                    {subject.horaInicio || ''}–{subject.horaFin || ''}
                  </p>
                ))}
                {exams.filter((exam) => weekdayFromIso(exam.fecha) === day).map((exam) => (
                  <p key={`e-${exam.id}`} className="exam-chip">
                    {exam.titulo}<br />
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
                <Button variant="secondary" onClick={async () => {
                  await deleteExam(exam.id)
                  await load()
                }}>Eliminar</Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default CalendarPage
