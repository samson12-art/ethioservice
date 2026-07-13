const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ethioservice',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '12345',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronized');
  } catch (error) {
    console.error('❌ PostgreSQL Error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };