const { StudySession, Subject } = require('../models');
const { buildStudyTimeStats } = require('../utils/buildStudyTimeStats');

async function getStudyTimeStats(usuarioId) {
  const sessions = await StudySession.findAll({
    where: { usuarioId, estado: 'completada' },
    include: [{
      model: Subject,
      attributes: ['id', 'nombre'],
      where: { usuarioId },
    }],
    order: [['fecha', 'ASC']],
  });

  return buildStudyTimeStats(sessions);
}

module.exports = { getStudyTimeStats };