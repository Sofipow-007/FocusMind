import { request } from './api'

export function getExams({ upcoming } = {}) {
  const query = upcoming ? '?upcoming=true' : ''
  return request(`/api/exams${query}`)
}

export function createExam(payload) {
  return request('/api/exams', { method: 'POST', body: payload })
}

export function updateExam(id, payload) {
  return request(`/api/exams/${id}`, { method: 'PUT', body: payload })
}

export function deleteExam(id) {
  return request(`/api/exams/${id}`, { method: 'DELETE' })
}
