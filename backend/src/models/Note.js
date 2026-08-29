const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  materiaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('definicion', 'consulta', 'apunte'),
    allowNull: false,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  origen: {
    type: DataTypes.ENUM('usuario', 'IA'),
    defaultValue: 'usuario',
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'respondida'),
    defaultValue: 'pendiente',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notas',
  timestamps: true,
});

module.exports = Note;
