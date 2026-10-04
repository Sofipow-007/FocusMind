const statsService = require('../services/statsService');

const getStudyTimeStats = async (req, res) => {
  try {
    const usuarioId = req.user?.userId;
    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });

    const stats = await statsService.getStudyTimeStats(usuarioId);
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getStudyTimeStats };
