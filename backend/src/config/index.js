const { Sequelize } = require('sequelize');
const envConfig = require('./env');

const databaseConfig = {
	host: envConfig.database.host,
	port: envConfig.database.port,
	database: envConfig.database.name,
	username: envConfig.database.user,
	password: envConfig.database.password,
};

const sequelize = new Sequelize(
	databaseConfig.database,
	databaseConfig.username,
	databaseConfig.password,
	{
		host: databaseConfig.host,
		port: databaseConfig.port,
		dialect: 'mysql',
		logging: envConfig.nodeEnv === 'development' ? console.log : false,
	},
);

module.exports = {
	databaseConfig,
	sequelize,
};
