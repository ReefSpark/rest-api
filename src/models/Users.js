const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/SequelizeConfig");

module.exports = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  agent: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "agents",
      key: "userName",
    },
  },
});
