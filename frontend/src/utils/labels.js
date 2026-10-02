export const WEEKDAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

export const SESSION_STATES = [
  { value: 'planificada', label: 'Planificada' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
]

export const NOTE_TYPES = [
  { value: 'definicion', label: 'Definición' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'apunte', label: 'Apunte' },
]

export function subjectNameById(subjects, materiaId) {
  return subjects.find((subject) => subject.id === Number(materiaId))?.nombre || 'Materia'
}
