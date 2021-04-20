const moment = require("moment");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/SequelizeConfig");

module.exports = sequelize.define("purchaseticket", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  ticketName: {
    type: DataTypes.STRING,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: "tickets",
      key: "ticketName",
    },
  },

  ticketPrice: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  winningAmount: {
    type: DataTypes.BIGINT,
  },

  sellingPrice: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  ticketNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  customer: {
    allowNull: false,
    type: DataTypes.STRING,
    onDelete: "CASCADE",
    references: {
      model: "users",
      key: "customerName",
    },
  },

  agent: {
    allowNull: false,
    type: DataTypes.STRING,
    onDelete: "CASCADE",
    references: {
      model: "agents",
      key: "userName",
    },
  },

  createdAt: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    defaultValue: moment(new Date()).format("YYYY-MM-DD"),
  },
});
