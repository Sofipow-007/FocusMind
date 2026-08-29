const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorita: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  prioritaria: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  diaEstudio: {
    type: DataTypes.ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'),
    allowNull: true,
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  horaFin: {
    type: DataTypes.TIME,
    allowNull: true,
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
  tableName: 'materias',
  timestamps: true,
});

module.exports = Subject;
