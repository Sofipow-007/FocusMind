const { Subject } = require('../models');

const createSubject = async (req, res) => {
  try {
    const { nombre, favorita, prioritaria, diaEstudio, horaInicio, horaFin } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la materia es obligatorio' });
    }

    const subject = await Subject.create({
      usuarioId: userId,
      nombre,
      favorita: favorita || false,
      prioritaria: prioritaria || false,
      diaEstudio: diaEstudio || null,
      horaInicio: horaInicio || null,
      horaFin: horaFin || null,
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

    const subjects = await Subject.findAll({ where: { usuarioId: userId } });

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

    const subject = await Subject.findOne({
      where: { id, usuarioId: userId },
    });

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

    const subject = await Subject.findOne({
      where: { id, usuarioId: userId },
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    await subject.update({
      nombre: nombre !== undefined ? nombre : subject.nombre,
      favorita: favorita !== undefined ? favorita : subject.favorita,
      prioritaria: prioritaria !== undefined ? prioritaria : subject.prioritaria,
      diaEstudio: diaEstudio !== undefined ? diaEstudio : subject.diaEstudio,
      horaInicio: horaInicio !== undefined ? horaInicio : subject.horaInicio,
      horaFin: horaFin !== undefined ? horaFin : subject.horaFin,
    });

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

    const subject = await Subject.findOne({
      where: { id, usuarioId: userId },
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    await subject.destroy();

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
