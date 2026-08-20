const { Sequelize } = require('sequelize');

const isServerless = !require.main || require.main !== module;

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || (isServerless ? 5 : 20),
      min: parseInt(process.env.DB_POOL_MIN) || (isServerless ? 0 : 5),
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'ethioservice',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX) || (isServerless ? 5 : 20),
        min: parseInt(process.env.DB_POOL_MIN) || (isServerless ? 0 : 5),
        acquire: 60000,
        idle: 10000
      },
      dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    }
  );
}

let dbConnected = false;

const connectDB = async () => {
  if (dbConnected) return;
  try {
    await sequelize.authenticate();
    dbConnected = true;
    console.log('PostgreSQL Connected');
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Tables synchronized');
    }
  } catch (error) {
    console.error('PostgreSQL Error:', error.message);
    if (!isServerless) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = { sequelize, connectDB };
