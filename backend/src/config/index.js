const { Sequelize } = require('sequelize');

const databaseConfig = {
	host: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT || 3306),
	database: process.env.DB_NAME || 'focusmind',
	username: process.env.DB_USER || 'focusmind',
	password: process.env.DB_PASSWORD || '',
};

const sequelize = new Sequelize(
	databaseConfig.database,
	databaseConfig.username,
	databaseConfig.password,
	{
		host: databaseConfig.host,
		port: databaseConfig.port,
		dialect: 'mysql',
		logging: process.env.NODE_ENV === 'development' ? console.log : false,
	},
);

module.exports = {
	databaseConfig,
	sequelize,
};
