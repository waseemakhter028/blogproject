const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env
const mysql2 = require('mysql2')

module.exports={
  "development": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": "mysql",
    "dialectModule": mysql2,
    "pool": { "max": 5, "min": 0, "idle": 10000 }
  },
  "test": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": "mysql",
    "dialectModule": mysql2,
    "pool": { "max": 5, "min": 0, "idle": 10000 }
  },
  "production": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": "mysql",
    "dialectModule": mysql2,
    "pool": { "max": 5, "min": 0, "idle": 10000 }
  }
}