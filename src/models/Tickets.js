const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/SequelizeConfig");

module.exports = sequelize.define("ticket", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  ticketName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  price: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  user: {
    allowNull: false,
    type: DataTypes.STRING,
    onDelete: "CASCADE",
    references: {
      model: "agents",
      key: "userName",
    },
  },
});
