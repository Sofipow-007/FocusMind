import { request } from './api'

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function register(nombre, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { nombre, email, password },
  })
}

export function getMe() {
  return request('/api/auth/me')
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}
