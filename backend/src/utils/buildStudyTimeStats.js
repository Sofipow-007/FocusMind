function toUtcDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('La fecha de una sesión debe ser válida');
  }
  return date.toISOString().slice(0, 10);
}

function shiftDateKey(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toUtcDateKey(date);
}

function aggregateSessions(sessions) {
  const bySubject = new Map();
  let totalMinutes = 0;

  sessions.forEach((session) => {
    const subjectId = session.Subject.id;
    const current = bySubject.get(subjectId) || {
      materiaId: subjectId,
      materia: session.Subject.nombre,
      sesiones: 0,
      minutos: 0,
    };
    current.sesiones += 1;
    current.minutos += session.duracion;
    totalMinutes += session.duracion;
    bySubject.set(subjectId, current);
  });

  return {
    totalMinutos: totalMinutes,
    totalSesiones: sessions.length,
    porMateria: Array.from(bySubject.values()),
  };
}

function buildPeriodStats(sessions, inicio, fin) {
  const periodSessions = sessions.filter((session) => {
    const dateKey = toUtcDateKey(session.fecha);
    return dateKey >= inicio && dateKey <= fin;
  });

  return { inicio, fin, ...aggregateSessions(periodSessions) };
}

function calculateStreak(dateKeys, todayKey) {
  const studyDays = new Set(dateKeys.filter((dateKey) => dateKey <= todayKey));
  const anchor = studyDays.has(todayKey)
    ? todayKey
    : shiftDateKey(todayKey, -1);

  if (!studyDays.has(anchor)) return 0;

  let streak = 0;
  let dateKey = anchor;
  while (studyDays.has(dateKey)) {
    streak += 1;
    dateKey = shiftDateKey(dateKey, -1);
  }

  return streak;
}

function buildStudyTimeStats(sessions, now = new Date()) {
  const todayKey = toUtcDateKey(now);
  const completedSessions = sessions.filter((session) => session.estado === 'completada');
  const currentDate = new Date(`${todayKey}T00:00:00.000Z`);
  const weekStart = new Date(currentDate);
  const daysSinceMonday = (weekStart.getUTCDay() + 6) % 7;
  weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

  const monthStart = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0));
  const studyDateKeys = completedSessions.map((session) => toUtcDateKey(session.fecha));
  const pastStudyDateKeys = studyDateKeys.filter((dateKey) => dateKey <= todayKey);
  const mostRecentStudyDate = pastStudyDateKeys.reduce(
    (latest, dateKey) => (latest === null || dateKey > latest ? dateKey : latest),
    null,
  );

  return {
    ...aggregateSessions(completedSessions),
    semanaActual: buildPeriodStats(
      completedSessions,
      toUtcDateKey(weekStart),
      toUtcDateKey(weekEnd),
    ),
    mesActual: buildPeriodStats(
      completedSessions,
      toUtcDateKey(monthStart),
      toUtcDateKey(monthEnd),
    ),
    rachaDias: calculateStreak(studyDateKeys, todayKey),
    ultimoDiaEstudiado: mostRecentStudyDate,
  };
}

module.exports = { buildStudyTimeStats };
