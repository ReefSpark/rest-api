const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/SequelizeConfig");

module.exports = sequelize.define("agent", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
  },

  mail: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  userName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
