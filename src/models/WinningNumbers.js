const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/SequelizeConfig");

module.exports = sequelize.define("winningnumber", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  date: {
    type: DataTypes.DATEONLY,
    unique: true,
    allowNull: false,
  },

  winningNumbers: {
    type: DataTypes.JSON,
    allowNull: false,
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
