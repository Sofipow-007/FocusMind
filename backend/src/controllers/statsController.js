const { StudySession, Subject } = require('../models');

const getStudyTimeStats = async (req, res) => {
  try {
    const usuarioId = req.user?.userId;
    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });

    const sessions = await StudySession.findAll({
      where: { usuarioId, estado: 'completada' },
      include: [{
        model: Subject,
        attributes: ['id', 'nombre'],
        where: { usuarioId },
      }],
      order: [['fecha', 'ASC']],
    });

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

    return res.status(200).json({
      totalMinutos: totalMinutes,
      totalSesiones: sessions.length,
      porMateria: Array.from(bySubject.values()),
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getStudyTimeStats };
