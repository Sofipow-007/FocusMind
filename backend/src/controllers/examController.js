const { Exam, Subject } = require('../models');
const {
  isNonEmptyString,
  isPositiveInteger,
  isValidDate,
} = require('../utils/validation');

const getUserId = (req) => req.user?.userId;

const createExam = async (req, res) => {
  try {
    const usuarioId = getUserId(req);
    const { materiaId, titulo, fecha, descripcion } = req.body || {};

    if (!usuarioId) return res.status(401).json({ message: 'No autorizado' });
    if (!isPositiveInteger(materiaId) || !isNonEmptyString(titulo) || !isValidDate(fecha) ||
      (descripcion !== undefined && descripcion !== null && !isNonEmptyString(descripcion))) {
      return res.status(400).json({ message: 'materiaId, titulo y fecha son obligatorios' });
    }

    const subject = await Subject.findOne({ where: { id: materiaId, usuarioId } });
    if (!subject) return res.status(404).json({ message: 'Materia no encontrada' });

    const exam = await Exam.create({
      usuarioId,
      materiaId,
      titulo: titulo.trim(),
      fecha,
      descripcion: descripcion?.trim() || null,
    });
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

    const where = { usuarioId };
    if (req.query.materiaId) where.materiaId = req.query.materiaId;
    if (req.query.upcoming === 'true') where.fecha = { [require('sequelize').Op.gte]: new Date() };

    const exams = await Exam.findAll({ where, order: [['fecha', 'ASC']] });
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
    const exam = await Exam.findOne({ where: { id: req.params.id, usuarioId } });
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
    const exam = await Exam.findOne({ where: { id: req.params.id, usuarioId } });
    if (!exam) return res.status(404).json({ message: 'Examen no encontrado' });
    const { titulo, fecha, descripcion } = req.body || {};
    if ((titulo !== undefined && !isNonEmptyString(titulo)) ||
      (fecha !== undefined && !isValidDate(fecha)) ||
      (descripcion !== undefined && descripcion !== null && !isNonEmptyString(descripcion))) {
      return res.status(400).json({ message: 'Los datos del examen no son válidos' });
    }
    await exam.update({
      titulo: titulo !== undefined ? titulo.trim() : exam.titulo,
      fecha: fecha !== undefined ? fecha : exam.fecha,
      descripcion: descripcion !== undefined ? descripcion.trim() : exam.descripcion,
    });
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
    const exam = await Exam.findOne({ where: { id: req.params.id, usuarioId } });
    if (!exam) return res.status(404).json({ message: 'Examen no encontrado' });
    await exam.destroy();
    return res.status(200).json({ message: 'Examen eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar examen:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createExam, getExams, getExamById, updateExam, deleteExam };
