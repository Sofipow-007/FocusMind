const envConfig = require('./env');

module.exports = {
  development: {
    username: envConfig.database.user,
    password: envConfig.database.password,
    database: envConfig.database.name,
    host: envConfig.database.host,
    port: envConfig.database.port,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: envConfig.database.user,
    password: envConfig.database.password,
    database: envConfig.database.name,
    host: envConfig.database.host,
    port: envConfig.database.port,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: envConfig.database.user,
    password: envConfig.database.password,
    database: envConfig.database.name,
    host: envConfig.database.host,
    port: envConfig.database.port,
    dialect: 'mysql',
    logging: false,
  },
};
