'use strict'
const fs = require('fs')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const basename = path.basename(__filename)
const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config, {
  // logging: console.log
  logging: false, // Disable logging
})

sequelize
  .authenticate()
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log('DB connection error: ' + err))

fs.readdirSync(__dirname)
  .filter((file) => {
    return !file.startsWith('.') && file !== basename && !file.startsWith('.js', -3)
  })
  .forEach((file) => {
    const model = require(`${path.join(__dirname, file)}`)(sequelize, DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
