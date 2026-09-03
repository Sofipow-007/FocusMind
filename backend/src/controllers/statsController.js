const { StudySession, Subject } = require('../models');
const { buildStudyTimeStats } = require('../utils/buildStudyTimeStats');

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

    return res.status(200).json(buildStudyTimeStats(sessions));
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getStudyTimeStats };
