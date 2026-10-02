module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Demo User',
        email: 'demo@focusmind.com',
        passwordHash: '$2b$10$wE0imdTVQv7dE0BMhuttpukXzXWWz7V6mV9R/hY7vB794dy/k6vDS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {
      ignoreDuplicates: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('usuarios', { email: 'demo@focusmind.com' }, {});
  },
};
