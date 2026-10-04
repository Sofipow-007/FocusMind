const { Op } = require('sequelize');
const { Exam, Subject } = require('../models');

async function createExam(usuarioId, data) {
  const subject = await Subject.findOne({
    where: { id: data.materiaId, usuarioId },
  });
  if (!subject) return null;

  return Exam.create({
    usuarioId,
    materiaId: data.materiaId,
    titulo: data.titulo.trim(),
    fecha: data.fecha,
    descripcion: data.descripcion?.trim() || null,
  });
}

async function getExams(usuarioId, filters = {}) {
  const where = { usuarioId };
  if (filters.materiaId) where.materiaId = filters.materiaId;
  if (filters.upcoming) where.fecha = { [Op.gte]: new Date() };
  return Exam.findAll({ where, order: [['fecha', 'ASC']] });
}

async function getExamById(usuarioId, id) {
  return Exam.findOne({ where: { id, usuarioId } });
}

async function updateExam(usuarioId, id, data) {
  const exam = await getExamById(usuarioId, id);
  if (!exam) return null;

  await exam.update({
    titulo: data.titulo !== undefined ? data.titulo.trim() : exam.titulo,
    fecha: data.fecha !== undefined ? data.fecha : exam.fecha,
    descripcion: data.descripcion !== undefined ? data.descripcion.trim() : exam.descripcion,
  });

  return exam;
}

async function deleteExam(usuarioId, id) {
  const exam = await getExamById(usuarioId, id);
  if (!exam) return false;

  await exam.destroy();
  return true;
}

module.exports = {
  createExam,
  deleteExam,
  getExamById,
  getExams,
  updateExam,
};
