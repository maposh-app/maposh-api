'use strict';

require('../../env');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    port: "5432",
    dialect: "postgres"
  },
  production: {
    username: process.env.RDS_DB_USERNAME,
    password: process.env.RDS_DB_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_DB_HOST,
    port: process.env.RDS_DB_PORT,
    dialect: "postgres",
    pool: {
      idle: 50000,
    },
  },
};

module.exports = config[env];
