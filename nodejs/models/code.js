'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Code extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SubCategory, { sourceKey: 'sub_category_id', foreignKey: 'id' })
    }
  }
  Code.init({
    sub_category_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    language: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Code',
    tableName: 'codes',
    timestamps: true,
    underscored: true
  });
  return Code;
};