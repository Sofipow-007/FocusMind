import { useEffect, useState } from 'react'

import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import InlineMessage from '../components/InlineMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import SelectField from '../components/SelectField'
import StatusBadge from '../components/StatusBadge'
import TextField from '../components/TextField'
import { createNote, deleteNote, getNotes, updateNote } from '../services/noteService'
import { getSubjects } from '../services/subjectService'
import { NOTE_TYPES, subjectNameById } from '../utils/labels'

const EMPTY_FORM = { materiaId: '', tipo: 'apunte', contenido: '', estado: 'pendiente' }

function NotesPage({ onNavigate }) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [subjects, setSubjects] = useState([])
  const [notes, setNotes] = useState([])
  const [filters, setFilters] = useState({ materiaId: '', tipo: '' })
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  async function load(nextFilters = filters) {
    const [subjectsResult, notesResult] = await Promise.all([
      getSubjects(),
      getNotes({
        materiaId: nextFilters.materiaId || undefined,
        tipo: nextFilters.tipo || undefined,
      }),
    ])
    setSubjects(subjectsResult)
    setNotes(notesResult)
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([getSubjects(), getNotes()])
      .then(([subjectsResult, notesResult]) => {
        if (!isMounted) return
        setSubjects(subjectsResult)
        setNotes(notesResult)
        setStatus('ready')
      })
      .catch((loadError) => {
        if (!isMounted) return
        setError(loadError.message)
        setStatus('error')
      })
    return () => { isMounted = false }
  }, [])

  async function applyFilters(nextFilters) {
    setFilters(nextFilters)
    setStatus('loading')
    try {
      await load(nextFilters)
      setStatus('ready')
    } catch (loadError) {
      setError(loadError.message)
      setStatus('error')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (subjects.length === 0) {
      setFormError('Creá una materia antes de guardar notas.')
      return
    }
    setIsSaving(true)

    try {
      if (editingId) {
        const payload = { contenido: form.contenido }
        if (form.tipo === 'consulta') payload.estado = form.estado
        await updateNote(editingId, payload)
      } else {
        const payload = {
          materiaId: Number(form.materiaId),
          tipo: form.tipo,
          contenido: form.contenido,
          origen: 'usuario',
        }
        if (form.tipo === 'consulta') payload.estado = form.estado
        await createNote(payload)
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

  if (status === 'loading') return <LoadingState label="Cargando notas..." />
  if (status === 'error') return <InlineMessage>{error}</InlineMessage>

  return (
    <div className="stack-lg">
      <PageHeader title="Notas" />

      {subjects.length === 0 ? (
        <EmptyState title="Necesitás una materia">
          <Button onClick={() => onNavigate('subjects')}>Ir a materias</Button>
        </EmptyState>
      ) : (
        <form className="card form-grid" onSubmit={handleSubmit}>
          <h2 className="section-title">{editingId ? 'Editar nota' : 'Nueva nota'}</h2>
          <SelectField label="Materia" value={form.materiaId} onChange={(event) => setForm({ ...form, materiaId: event.target.value })} required={!editingId}>
            <option value="">Elegí una materia</option>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.nombre}</option>)}
          </SelectField>
          <SelectField label="Tipo" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })}>
            {NOTE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </SelectField>
          <TextField label="Contenido" rows={4} value={form.contenido} onChange={(event) => setForm({ ...form, contenido: event.target.value })} required />
          {form.tipo === 'consulta' ? (
            <SelectField label="Estado de la consulta" value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })}>
              <option value="pendiente">Pendiente</option>
              <option value="respondida">Respondida</option>
            </SelectField>
          ) : null}
          <InlineMessage>{formError}</InlineMessage>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
        </form>
      )}

      <div className="row">
        <SelectField label="Filtrar por materia" value={filters.materiaId} onChange={(event) => applyFilters({ ...filters, materiaId: event.target.value })}>
          <option value="">Todas</option>
          {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.nombre}</option>)}
        </SelectField>
        <SelectField label="Filtrar por tipo" value={filters.tipo} onChange={(event) => applyFilters({ ...filters, tipo: event.target.value })}>
          <option value="">Todos</option>
          {NOTE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
        </SelectField>
      </div>

      {notes.length === 0 ? (
        <EmptyState title="No hay notas">Creá un apunte, definición o consulta.</EmptyState>
      ) : (
        <ul className="list">
          {notes.map((note) => (
            <li key={note.id} className="card stack">
              <div className="row">
                <strong>{subjectNameById(subjects, note.materiaId)}</strong>
                <StatusBadge label={note.tipo} tone="neutral" />
                {note.tipo === 'consulta' ? <StatusBadge label={note.estado} tone={note.estado} /> : null}
                <span className="muted">{note.origen}</span>
              </div>
              <p>{note.contenido}</p>
              <div className="row">
                <Button variant="secondary" onClick={() => {
                  setEditingId(note.id)
                  setForm({
                    materiaId: String(note.materiaId),
                    tipo: note.tipo,
                    contenido: note.contenido,
                    estado: note.estado || 'pendiente',
                  })
                }}>Editar</Button>
                <Button variant="secondary" onClick={async () => {
                  await deleteNote(note.id)
                  await load()
                }}>Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NotesPage
