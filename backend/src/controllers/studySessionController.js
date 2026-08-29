const { StudySession, Subject } = require('../models');

const createStudySession = async (req, res) => {
  try {
    const { materiaId, fecha, duracion, descripcion, estado } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!materiaId || !fecha || !duracion) {
      return res.status(400).json({ message: 'materiaId, fecha y duracion son obligatorios' });
    }

    // Verificar que la materia pertenece al usuario
    const subject = await Subject.findOne({
      where: { id: materiaId, usuarioId: userId },
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    const session = await StudySession.create({
      usuarioId: userId,
      materiaId,
      fecha,
      duracion,
      descripcion: descripcion || '',
      estado: estado || 'planificada',
    });

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

    const where = { usuarioId: userId };
    if (materiaId) {
      where.materiaId = materiaId;
    }

    const sessions = await StudySession.findAll({ where });

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

    const session = await StudySession.findOne({
      where: { id, usuarioId: userId },
    });

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

    const session = await StudySession.findOne({
      where: { id, usuarioId: userId },
    });

    if (!session) {
      return res.status(404).json({ message: 'Sesión de estudio no encontrada' });
    }

    await session.update({
      fecha: fecha !== undefined ? fecha : session.fecha,
      duracion: duracion !== undefined ? duracion : session.duracion,
      descripcion: descripcion !== undefined ? descripcion : session.descripcion,
      estado: estado !== undefined ? estado : session.estado,
    });

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

    const session = await StudySession.findOne({
      where: { id, usuarioId: userId },
    });

    if (!session) {
      return res.status(404).json({ message: 'Sesión de estudio no encontrada' });
    }

    await session.destroy();

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
