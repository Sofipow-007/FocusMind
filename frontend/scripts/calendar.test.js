import assert from 'node:assert/strict'
import test from 'node:test'

import { getCalendarWeek, toLocalDateIso } from '../src/utils/calendar.js'

function localDate(year, monthIndex, day, hour = 0, minute = 0) {
  return new Date(year, monthIndex, day, hour, minute)
}

function isoDate(date) {
  return date.toISOString()
}

test('genera la semana local de lunes a domingo con fechas inclusivas', () => {
  const week = getCalendarWeek({ now: localDate(2026, 10, 4, 12) })

  assert.deepEqual(week.map(({ weekday }) => weekday), [
    'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
  ])
  assert.equal(toLocalDateIso(week[0].date), '2026-11-02')
  assert.equal(toLocalDateIso(week[6].date), '2026-11-08')
})

test('incluye solo sesiones planificadas dentro de la semana y las ordena por hora', () => {
  const mondayAtTen = localDate(2026, 10, 2, 10)
  const mondayAtNine = localDate(2026, 10, 2, 9)
  const sessions = [
    { id: 1, fecha: isoDate(mondayAtTen), estado: 'planificada' },
    { id: 2, fecha: isoDate(mondayAtNine), estado: 'planificada' },
    { id: 3, fecha: isoDate(localDate(2026, 10, 2, 8)), estado: 'completada' },
    { id: 4, fecha: isoDate(localDate(2026, 10, 1, 23, 59)), estado: 'planificada' },
    { id: 5, fecha: isoDate(localDate(2026, 10, 9)), estado: 'planificada' },
  ]

  const week = getCalendarWeek({ sessions, now: localDate(2026, 10, 4, 12) })

  assert.deepEqual(week[0].sessions.map(({ id }) => id), [2, 1])
  assert.ok(week.every((day) => day.sessions.every(({ estado }) => estado === 'planificada')))
})

test('incluye exámenes no vencidos dentro de la semana y excluye vencidos y externos', () => {
  const now = localDate(2026, 10, 4, 12)
  const exams = [
    { id: 1, fecha: isoDate(now) },
    { id: 2, fecha: isoDate(localDate(2026, 10, 4, 11)) },
    { id: 3, fecha: isoDate(localDate(2026, 10, 8, 9)) },
    { id: 4, fecha: isoDate(localDate(2026, 10, 9, 9)) },
  ]

  const week = getCalendarWeek({ exams, now })

  assert.deepEqual(week[2].exams.map(({ id }) => id), [1])
  assert.deepEqual(week[6].exams.map(({ id }) => id), [3])
  assert.equal(week.reduce((count, day) => count + day.exams.length, 0), 2)
})

test('la semana puede cruzar de año sin cambiar el orden de sus siete días', () => {
  const week = getCalendarWeek({ now: localDate(2027, 0, 1, 12) })

  assert.equal(toLocalDateIso(week[0].date), '2026-12-28')
  assert.equal(toLocalDateIso(week[6].date), '2027-01-03')
})
