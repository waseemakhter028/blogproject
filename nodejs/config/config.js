const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_POOL_MIN, DB_POOL_MAX, DB_POOL_IDLE, DB_PORT } =
  process.env
const mysql2 = require('mysql2')
const min = parseInt(DB_POOL_MIN)
const max = parseInt(DB_POOL_MAX)
const idle = parseInt(DB_POOL_IDLE)
module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: { max: max, min: min, idle: idle }
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: { max: max, min: min, idle: idle }
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: { max: max, min: min, idle: idle }
  }
}
