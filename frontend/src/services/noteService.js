import { request } from './api'

export function getNotes({ materiaId, tipo } = {}) {
  const params = new URLSearchParams()
  if (materiaId) params.set('materiaId', materiaId)
  if (tipo) params.set('tipo', tipo)
  const query = params.toString() ? `?${params.toString()}` : ''
  return request(`/api/notes${query}`)
}

export function createNote(payload) {
  return request('/api/notes', { method: 'POST', body: payload })
}

export function updateNote(id, payload) {
  return request(`/api/notes/${id}`, { method: 'PUT', body: payload })
}

export function deleteNote(id) {
  return request(`/api/notes/${id}`, { method: 'DELETE' })
}
