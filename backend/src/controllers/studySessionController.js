const studySessionService = require('../services/studySessionService');
const { validateStudySessionInput } = require('../validators/studySessionValidator');

const createStudySession = async (req, res) => {
  try {
    const { materiaId, fecha, duracion, descripcion, estado } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const validationError = validateStudySessionInput({ materiaId, fecha, duracion, descripcion, estado });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const session = await studySessionService.createStudySession(userId, {
      materiaId,
      fecha,
      duracion,
      descripcion,
      estado,
    });

    if (!session) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    return res.status(201).json({ message: 'Sesión de estudio creada correctamente', session });
  } catch (error) {
    console.error('Error al crear sesión de estudio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getStudySessions = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { materiaId } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const sessions = await studySessionService.getStudySessions(userId, materiaId);

    return res.status(200).json(sessions);
  } catch (error) {
    console.error('Error al obtener sesiones de estudio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getStudySessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const session = await studySessionService.getStudySessionById(userId, id);

    if (!session) {
      return res.status(404).json({ message: 'Sesión de estudio no encontrada' });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error('Error al obtener sesión de estudio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateStudySession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { fecha, duracion, descripcion, estado } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const validationError = validateStudySessionInput(
      { fecha, duracion, descripcion, estado },
      true,
    );
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const session = await studySessionService.updateStudySession(userId, id, {
      fecha,
      duracion,
      descripcion,
      estado,
    });

    if (!session) {
      return res.status(404).json({ message: 'Sesión de estudio no encontrada' });
    }

    return res.status(200).json({ message: 'Sesión de estudio actualizada correctamente', session });
  } catch (error) {
    console.error('Error al actualizar sesión de estudio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteStudySession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const deleted = await studySessionService.deleteStudySession(userId, id);
    if (!deleted) {
      return res.status(404).json({ message: 'Sesión de estudio no encontrada' });
    }

    return res.status(200).json({ message: 'Sesión de estudio eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar sesión de estudio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createStudySession,
  getStudySessions,
  getStudySessionById,
  updateStudySession,
  deleteStudySession,
};
