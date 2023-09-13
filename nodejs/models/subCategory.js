'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   this.hasMany(models.Code, { sourceKey: 'id', foreignKey: 'sub_category_id' })
    //   this.belongsTo(models.Category, { sourceKey: 'category_id', foreignKey: 'id' })
    // }
  }
  SubCategory.init({
    name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubCategory',
    tableName: 'sub_categories',
    timestamps: true,
    underscored: true
  });
  return SubCategory;
};