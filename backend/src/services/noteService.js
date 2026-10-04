const { Note, Subject } = require('../models');

async function createNote(usuarioId, data) {
  const subject = await Subject.findOne({
    where: { id: data.materiaId, usuarioId },
  });
  if (!subject) return null;

  return Note.create({
    usuarioId,
    materiaId: data.materiaId,
    tipo: data.tipo,
    contenido: data.contenido.trim(),
    origen: data.origen || 'usuario',
    estado: data.tipo === 'consulta' ? (data.estado || 'pendiente') : null,
  });
}

async function getNotes(usuarioId, filters = {}) {
  const where = { usuarioId };
  if (filters.materiaId) where.materiaId = filters.materiaId;
  if (filters.tipo) where.tipo = filters.tipo;
  return Note.findAll({ where });
}

async function getNoteById(usuarioId, id) {
  return Note.findOne({ where: { id, usuarioId } });
}

async function updateNote(usuarioId, id, data) {
  const note = await getNoteById(usuarioId, id);
  if (!note) return { note: null };
  if (data.estado !== undefined && note.tipo !== 'consulta') {
    return { note, error: 'El estado solo aplica a notas de tipo consulta' };
  }

  await note.update({
    contenido: data.contenido !== undefined ? data.contenido.trim() : note.contenido,
    estado: data.estado !== undefined ? data.estado : note.estado,
  });

  return { note };
}

async function deleteNote(usuarioId, id) {
  const note = await getNoteById(usuarioId, id);
  if (!note) return false;

  await note.destroy();
  return true;
}

module.exports = {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
};
