function buildStudyTimeStats(sessions) {
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

module.exports = { buildStudyTimeStats };
