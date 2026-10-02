const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

export async function request(path, options = {}) {
  const { method = 'GET', body, headers } = options

  const response = await fetch(`${apiUrl}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || `La API respondió con estado ${response.status}`)
    error.status = response.status
    throw error
  }

  return data
}

export async function getHealth() {
  return request('/api/health')
}
