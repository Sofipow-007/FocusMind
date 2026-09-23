const { Note, Subject } = require('../models');
const {
  NOTE_ORIGINS,
  NOTE_STATES,
  NOTE_TYPES,
  isNonEmptyString,
  isPositiveInteger,
} = require('../utils/validation');

const createNote = async (req, res) => {
  try {
    const { materiaId, tipo, contenido, origen, estado } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!isPositiveInteger(materiaId) || !NOTE_TYPES.includes(tipo) || !isNonEmptyString(contenido) ||
      (origen !== undefined && !NOTE_ORIGINS.includes(origen)) ||
      (estado !== undefined && !NOTE_STATES.includes(estado)) ||
      (tipo !== 'consulta' && estado !== undefined)) {
      return res.status(400).json({ message: 'materiaId, tipo y contenido son obligatorios' });
    }

    // Verificar que la materia pertenece al usuario
    const subject = await Subject.findOne({
      where: { id: materiaId, usuarioId: userId },
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    const note = await Note.create({
      usuarioId: userId,
      materiaId,
      tipo,
      contenido: contenido.trim(),
      origen: origen || 'usuario',
      estado: tipo === 'consulta' ? (estado || 'pendiente') : null,
    });

    return res.status(201).json({ message: 'Nota creada correctamente', note });
  } catch (error) {
    console.error('Error al crear nota:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getNotes = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { materiaId, tipo } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const where = { usuarioId: userId };
    if (materiaId) {
      where.materiaId = materiaId;
    }
    if (tipo) {
      where.tipo = tipo;
    }

    const notes = await Note.findAll({ where });

    return res.status(200).json(notes);
  } catch (error) {
    console.error('Error al obtener notas:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const note = await Note.findOne({
      where: { id, usuarioId: userId },
    });

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error('Error al obtener nota:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { contenido, estado } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if ((contenido !== undefined && !isNonEmptyString(contenido)) ||
      (estado !== undefined && !NOTE_STATES.includes(estado))) {
      return res.status(400).json({ message: 'Los datos de la nota no son válidos' });
    }

    const note = await Note.findOne({
      where: { id, usuarioId: userId },
    });

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (estado !== undefined && note.tipo !== 'consulta') {
      return res.status(400).json({ message: 'El estado solo aplica a notas de tipo consulta' });
    }

    await note.update({
      contenido: contenido !== undefined ? contenido.trim() : note.contenido,
      estado: estado !== undefined ? estado : note.estado,
    });

    return res.status(200).json({ message: 'Nota actualizada correctamente', note });
  } catch (error) {
    console.error('Error al actualizar nota:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const note = await Note.findOne({
      where: { id, usuarioId: userId },
    });

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    await note.destroy();

    return res.status(200).json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar nota:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
