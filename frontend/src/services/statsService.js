import { request } from './api'

export function getStudyTimeStats() {
  return request('/api/stats/study-time')
}
