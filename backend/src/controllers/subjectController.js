const subjectService = require('../services/subjectService');
const { validateSubjectInput } = require('../validators/subjectValidator');

const createSubject = async (req, res) => {
  try {
    const { nombre, favorita, prioritaria, diaEstudio, horaInicio, horaFin } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const validationError = validateSubjectInput({ nombre, favorita, prioritaria, diaEstudio, horaInicio, horaFin });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const subject = await subjectService.createSubject(userId, {
      nombre,
      favorita,
      prioritaria,
      diaEstudio,
      horaInicio,
      horaFin,
    });

    return res.status(201).json({ message: 'Materia creada correctamente', subject });
  } catch (error) {
    console.error('Error al crear materia:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getSubjects = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const subjects = await subjectService.getSubjects(userId);

    return res.status(200).json(subjects);
  } catch (error) {
    console.error('Error al obtener materias:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const subject = await subjectService.getSubjectById(userId, id);

    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    return res.status(200).json(subject);
  } catch (error) {
    console.error('Error al obtener materia:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { nombre, favorita, prioritaria, diaEstudio, horaInicio, horaFin } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const validationError = validateSubjectInput(
      { nombre, favorita, prioritaria, diaEstudio, horaInicio, horaFin },
      true,
    );
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const subject = await subjectService.updateSubject(userId, id, {
      nombre,
      favorita,
      prioritaria,
      diaEstudio,
      horaInicio,
      horaFin,
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    return res.status(200).json({ message: 'Materia actualizada correctamente', subject });
  } catch (error) {
    console.error('Error al actualizar materia:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const deleted = await subjectService.deleteSubject(userId, id);
    if (!deleted) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    return res.status(200).json({ message: 'Materia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar materia:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
