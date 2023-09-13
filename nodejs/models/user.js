'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   this.hasMany(models.Order, { sourceKey: 'id', foreignKey: 'user_id' })
    // }
  }
  User.init({
    name:  {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('name');
        return rawValue ? rawValue.toUpperCase() : null;
      },
      set(value) {
          this.setDataValue('name', value.toLowerCase());
      }
    },
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    city: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: true,
        // areEquals: (value) => { custom validation rule
        //   if (value != "was") {
        //     throw new Error("City not right");
        //   }
        // }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate:{
        isNumeric: true,
      }
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.name} ${this.age}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};