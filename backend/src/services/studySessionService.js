const { StudySession, Subject } = require('../models');

async function createStudySession(usuarioId, data) {
  const subject = await Subject.findOne({
    where: { id: data.materiaId, usuarioId },
  });
  if (!subject) return null;

  return StudySession.create({
    usuarioId,
    materiaId: data.materiaId,
    fecha: data.fecha,
    duracion: data.duracion,
    descripcion: data.descripcion?.trim() || '',
    estado: data.estado || 'planificada',
  });
}

async function getStudySessions(usuarioId, materiaId) {
  const where = { usuarioId };
  if (materiaId) where.materiaId = materiaId;
  return StudySession.findAll({ where });
}

async function getStudySessionById(usuarioId, id) {
  return StudySession.findOne({ where: { id, usuarioId } });
}

async function updateStudySession(usuarioId, id, data) {
  const session = await getStudySessionById(usuarioId, id);
  if (!session) return null;

  await session.update({
    fecha: data.fecha !== undefined ? data.fecha : session.fecha,
    duracion: data.duracion !== undefined ? data.duracion : session.duracion,
    descripcion: data.descripcion !== undefined ? data.descripcion : session.descripcion,
    estado: data.estado !== undefined ? data.estado : session.estado,
  });

  return session;
}

async function deleteStudySession(usuarioId, id) {
  const session = await getStudySessionById(usuarioId, id);
  if (!session) return false;

  await session.destroy();
  return true;
}

module.exports = {
  createStudySession,
  deleteStudySession,
  getStudySessionById,
  getStudySessions,
  updateStudySession,
};
