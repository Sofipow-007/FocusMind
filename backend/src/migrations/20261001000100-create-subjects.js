module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('materias', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      favorita: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      prioritaria: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      diaEstudio: {
        type: Sequelize.ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'),
        allowNull: true,
      },
      horaInicio: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      horaFin: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('materias');
  },
};
