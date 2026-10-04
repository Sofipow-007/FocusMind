const examService = require('../services/examService');
const { validateExamInput } = require('../validators/examValidator');

const getUserId = (req) => req.user?.userId;

const createExam = async (req, res) => {
  try {
    const usuarioId = getUserId(req);
    const { materiaId, titulo, fecha, descripcion } = req.body || {};

    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });
    const validationError = validateExamInput({ materiaId, titulo, fecha, descripcion });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const exam = await examService.createExam(usuarioId, { materiaId, titulo, fecha, descripcion });
    if (!exam) return res.status(404).json({ message: 'Materia no encontrada' });
    return res.status(201).json({ message: 'Examen creado correctamente', exam });
  } catch (error) {
    console.error('Error al crear examen:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getExams = async (req, res) => {
  try {
    const usuarioId = getUserId(req);
    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });

    const exams = await examService.getExams(usuarioId, {
      materiaId: req.query.materiaId,
      upcoming: req.query.upcoming === 'true',
    });
    return res.status(200).json(exams);
  } catch (error) {
    console.error('Error al obtener exámenes:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getExamById = async (req, res) => {
  try {
    const usuarioId = getUserId(req);
    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });
    const exam = await examService.getExamById(usuarioId, req.params.id);
    if (!exam) return res.status(404).json({ message: 'Examen no encontrado' });
    return res.status(200).json(exam);
  } catch (error) {
    console.error('Error al obtener examen:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateExam = async (req, res) => {
  try {
    const usuarioId = getUserId(req);
    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });
    const { titulo, fecha, descripcion } = req.body || {};
    const validationError = validateExamInput({ titulo, fecha, descripcion }, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const exam = await examService.updateExam(usuarioId, req.params.id, { titulo, fecha, descripcion });
    if (!exam) return res.status(404).json({ message: 'Examen no encontrado' });
    return res.status(200).json({ message: 'Examen actualizado correctamente', exam });
  } catch (error) {
    console.error('Error al actualizar examen:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteExam = async (req, res) => {
  try {
    const usuarioId = getUserId(req);
    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });
    const deleted = await examService.deleteExam(usuarioId, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Examen no encontrado' });
    return res.status(200).json({ message: 'Examen eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar examen:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createExam, getExams, getExamById, updateExam, deleteExam };
