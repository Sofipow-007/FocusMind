import { request } from './api'

export function getSubjects() {
  return request('/api/subjects')
}

export function createSubject(payload) {
  return request('/api/subjects', { method: 'POST', body: payload })
}

export function updateSubject(id, payload) {
  return request(`/api/subjects/${id}`, { method: 'PUT', body: payload })
}

export function deleteSubject(id) {
  return request(`/api/subjects/${id}`, { method: 'DELETE' })
}
