import { useEffect, useState } from 'react'

import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import InlineMessage from '../components/InlineMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import SelectField from '../components/SelectField'
import SubjectCard from '../components/SubjectCard'
import TextField from '../components/TextField'
import { createSubject, deleteSubject, getSubjects, updateSubject } from '../services/subjectService'
import { WEEKDAYS } from '../utils/labels'

const EMPTY_FORM = {
  nombre: '',
  favorita: false,
  prioritaria: false,
  diaEstudio: '',
  horaInicio: '',
  horaFin: '',
}

function SubjectsPage() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  async function loadSubjects() {
    const data = await getSubjects()
    setSubjects(data)
  }

  useEffect(() => {
    let isMounted = true
    getSubjects()
      .then((data) => {
        if (!isMounted) return
        setSubjects(data)
        setStatus('ready')
      })
      .catch((loadError) => {
        if (!isMounted) return
        setError(loadError.message)
        setStatus('error')
      })
    return () => { isMounted = false }
  }, [])

  function startEdit(subject) {
    setEditingId(subject.id)
    setForm({
      nombre: subject.nombre,
      favorita: Boolean(subject.favorita),
      prioritaria: Boolean(subject.prioritaria),
      diaEstudio: subject.diaEstudio || '',
      horaInicio: subject.horaInicio ? String(subject.horaInicio).slice(0, 5) : '',
      horaFin: subject.horaFin ? String(subject.horaFin).slice(0, 5) : '',
    })
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setIsSaving(true)
    const payload = {
      nombre: form.nombre,
      favorita: form.favorita,
      prioritaria: form.prioritaria,
      diaEstudio: form.diaEstudio || null,
      horaInicio: form.horaInicio || null,
      horaFin: form.horaFin || null,
    }

    try {
      if (editingId) {
        await updateSubject(editingId, payload)
      } else {
        await createSubject(payload)
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      await loadSubjects()
    } catch (saveError) {
      setFormError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(subject) {
    const confirmed = window.confirm(`Eliminar "${subject.nombre}" también borra sus sesiones, notas y exámenes. ¿Continuar?`)
    if (!confirmed) return
    try {
      await deleteSubject(subject.id)
      await loadSubjects()
    } catch (deleteError) {
      setFormError(deleteError.message)
    }
  }

  if (status === 'loading') return <LoadingState label="Cargando materias..." />
  if (status === 'error') return <InlineMessage>{error}</InlineMessage>

  return (
    <div className="stack-lg">
      <PageHeader title="Materias" />

      <form className="card form-grid" onSubmit={handleSubmit}>
        <h2 className="section-title">{editingId ? 'Editar materia' : 'Nueva materia'}</h2>
        <TextField label="Nombre" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
        <label>
          <input type="checkbox" checked={form.favorita} onChange={(event) => setForm({ ...form, favorita: event.target.checked })} />
          {' '}Favorita
        </label>
        <label>
          <input type="checkbox" checked={form.prioritaria} onChange={(event) => setForm({ ...form, prioritaria: event.target.checked })} />
          {' '}Prioritaria
        </label>
        <SelectField label="Día de estudio" value={form.diaEstudio} onChange={(event) => setForm({ ...form, diaEstudio: event.target.value })}>
          <option value="">Sin bloque semanal</option>
          {WEEKDAYS.map((day) => <option key={day} value={day}>{day}</option>)}
        </SelectField>
        <TextField label="Hora de inicio" type="time" value={form.horaInicio} onChange={(event) => setForm({ ...form, horaInicio: event.target.value })} />
        <TextField label="Hora de fin" type="time" value={form.horaFin} onChange={(event) => setForm({ ...form, horaFin: event.target.value })} />
        <InlineMessage>{formError}</InlineMessage>
        <div className="row">
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
          {editingId ? (
            <Button variant="secondary" onClick={() => { setEditingId(null); setForm(EMPTY_FORM) }}>Cancelar</Button>
          ) : null}
        </div>
      </form>

      {subjects.length === 0 ? (
        <EmptyState title="Todavía no tenés materias">Creá la primera para registrar sesiones y notas.</EmptyState>
      ) : (
        <ul className="list">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <SubjectCard
                subject={subject}
                actions={(
                  <div className="row">
                    <Button variant="secondary" onClick={() => startEdit(subject)}>Editar</Button>
                    <Button variant="secondary" onClick={() => handleDelete(subject)}>Eliminar</Button>
                  </div>
                )}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SubjectsPage
