import { WEEKDAYS } from './labels.js'

function isWithinRange(value, start, endExclusive) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) &&
    date.getTime() >= start.getTime() &&
    date.getTime() < endExclusive.getTime()
}

export function getCalendarWeek({ sessions = [], exams = [], now = new Date() } = {}) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const endExclusive = new Date(date)
    endExclusive.setDate(date.getDate() + 1)

    const daySessions = sessions
      .filter((session) => session.estado === 'planificada' &&
        isWithinRange(session.fecha, date, endExclusive))
      .sort((first, second) => new Date(first.fecha) - new Date(second.fecha))

    const dayExams = exams
      .filter((exam) => new Date(exam.fecha).getTime() >= now.getTime() &&
        isWithinRange(exam.fecha, date, endExclusive))
      .sort((first, second) => new Date(first.fecha) - new Date(second.fecha))

    return {
      date,
      weekday: WEEKDAYS[(date.getDay() + 6) % 7],
      sessions: daySessions,
      exams: dayExams,
    }
  })
}

export function toLocalDateIso(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
