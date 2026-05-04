'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.hasMany(models.Loan, {
        foreignKey: "Item_id"
      });
    }
  }
  Item.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    image:{
    type: DataTypes.STRING,
     get() {
      const rawValue = this.getDataValue('username');
      return rawValue ? rawValue.toUpperCase() : null;
    },
  } 
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};