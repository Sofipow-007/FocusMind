const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

export async function getHealth() {
  const response = await fetch(`${apiUrl}/api/health`)

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`)
  }

  return response.json()
}
