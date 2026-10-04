const { Subject } = require('../models');

async function createSubject(usuarioId, data) {
  return Subject.create({
    usuarioId,
    nombre: data.nombre.trim(),
    favorita: data.favorita ?? false,
    prioritaria: data.prioritaria ?? false,
    diaEstudio: data.diaEstudio || null,
    horaInicio: data.horaInicio || null,
    horaFin: data.horaFin || null,
  });
}

async function getSubjects(usuarioId) {
  return Subject.findAll({ where: { usuarioId } });
}

async function getSubjectById(usuarioId, id) {
  return Subject.findOne({ where: { id, usuarioId } });
}

async function updateSubject(usuarioId, id, data) {
  const subject = await getSubjectById(usuarioId, id);
  if (!subject) return null;

  await subject.update({
    nombre: data.nombre !== undefined ? data.nombre.trim() : subject.nombre,
    favorita: data.favorita !== undefined ? data.favorita : subject.favorita,
    prioritaria: data.prioritaria !== undefined ? data.prioritaria : subject.prioritaria,
    diaEstudio: data.diaEstudio !== undefined ? data.diaEstudio : subject.diaEstudio,
    horaInicio: data.horaInicio !== undefined ? data.horaInicio : subject.horaInicio,
    horaFin: data.horaFin !== undefined ? data.horaFin : subject.horaFin,
  });

  return subject;
}

async function deleteSubject(usuarioId, id) {
  const subject = await getSubjectById(usuarioId, id);
  if (!subject) return false;

  await subject.destroy();
  return true;
}

module.exports = {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
};
