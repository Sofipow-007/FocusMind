const User = require('./User');
const Subject = require('./Subject');
const StudySession = require('./StudySession');
const Note = require('./Note');

// Definir relaciones
// Un usuario tiene muchas materias
User.hasMany(Subject, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Subject.belongsTo(User, { foreignKey: 'usuarioId' });

// Una materia tiene muchas sesiones de estudio
Subject.hasMany(StudySession, { foreignKey: 'materiaId', onDelete: 'CASCADE' });
StudySession.belongsTo(Subject, { foreignKey: 'materiaId' });

// Un usuario tiene muchas sesiones de estudio
User.hasMany(StudySession, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
StudySession.belongsTo(User, { foreignKey: 'usuarioId' });

// Una materia tiene muchas notas
Subject.hasMany(Note, { foreignKey: 'materiaId', onDelete: 'CASCADE' });
Note.belongsTo(Subject, { foreignKey: 'materiaId' });

// Un usuario tiene muchas notas
User.hasMany(Note, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'usuarioId' });

module.exports = {
  User,
  Subject,
  StudySession,
  Note,
};
