const noteService = require('../services/noteService');
const { validateNoteInput, validateNoteUpdateInput } = require('../validators/noteValidator');

const createNote = async (req, res) => {
  try {
    const { materiaId, tipo, contenido, origen, estado } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const validationError = validateNoteInput({ materiaId, tipo, contenido, origen, estado });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const note = await noteService.createNote(userId, { materiaId, tipo, contenido, origen, estado });
    if (!note) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

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

    const notes = await noteService.getNotes(userId, { materiaId, tipo });

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

    const note = await noteService.getNoteById(userId, id);

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

    const validationError = validateNoteUpdateInput({ contenido, estado });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await noteService.updateNote(userId, id, { contenido, estado });
    const { note } = result;

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

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

    const deleted = await noteService.deleteNote(userId, id);
    if (!deleted) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

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
