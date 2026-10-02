export function toDateTimeLocalValue(isoDate) {
  if (!isoDate) return ''

  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDateTimeLocalValue(value) {
  if (!value) return ''
  return new Date(value).toISOString()
}

export function formatDateTime(isoDate) {
  if (!isoDate) return 'Sin fecha'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export function weekdayFromIso(isoDate) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return null
  return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][date.getDay()]
}
