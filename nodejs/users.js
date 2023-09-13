'use strict';
const { access } = require('fs');
const {
  Model
} = require('sequelize');
module.exports  = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.UserBucket, {foreignKey: 'user_id', foreignKeyConstraint: true});
      // this.hasOne(models.UserExchanges, {foreignKey: 'user_id', foreignKeyConstraint: true});
    }
  };
  User.init({
    name:  DataTypes.STRING,
    email: DataTypes.STRING,
    city: DataTypes.STRING,
    age: DataTypes.INTEGER
    }, 
    {
      sequelize,
      tableName: 'users',
      modelName : 'User',
      freezeTableName: true,
      indexes: [{unique:true, fields: ["email"]}]
    
  });

  return User;
  
};

