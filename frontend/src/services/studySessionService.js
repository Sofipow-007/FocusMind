import { request } from './api'

export function getStudySessions(materiaId) {
  const query = materiaId ? `?materiaId=${encodeURIComponent(materiaId)}` : ''
  return request(`/api/study-sessions${query}`)
}

export function createStudySession(payload) {
  return request('/api/study-sessions', { method: 'POST', body: payload })
}

export function updateStudySession(id, payload) {
  return request(`/api/study-sessions/${id}`, { method: 'PUT', body: payload })
}

export function deleteStudySession(id) {
  return request(`/api/study-sessions/${id}`, { method: 'DELETE' })
}
