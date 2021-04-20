const sequelize = require("sequelize");
const moment = require("moment");

const UserModel = require("../models/Users");
const AgentModel = require("../models/Agents");
const TicketModel = require("../models/Tickets");
const PurchaseModel = require("../models/purchaseTicket");

const { PriceCalculation } = require("../utils/priceCalculation");

async function purchaseTicket(req, res) {
  try {
    const newUser = req.body.newuser || "";
    const username = req.user.user;
    const user = req.body.user || newUser;
    const sellingPrice = parseInt(req.body.sellingprice);
    const ticketPrice = parseInt(req.body.ticketprice);
    const ticketNumbers = req.body.ticketnumbers;
    let ticketObject = [];

    const agent = await AgentModel.findOne({
      where: { userName: username },
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err);
      });

    if (newUser) {
      await UserModel.create({
        customerName: newUser,
        agent: agent.userName,
      }).catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          throw new Error("Username already exists.");
        }
      });
    }

    const ticketDetails = await TicketModel.findOne({
      where: { price: ticketPrice },
      raw: true,
    })
      .then((onfulfilled) => {
        if (!onfulfilled) {
          return res.status(200).json({
            message: "No tickets where found for the given price",
          });
        }
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err.message);
      });

    ticketNumbers.forEach((ticket) => {
      ticketObject.push({
        ticketName: ticketDetails.ticketName,
        ticketPrice: ticketPrice,
        sellingPrice: sellingPrice,
        ticketNumber: ticket,
        customer: user,
        agent: agent.userName,
      });
    });

    await PurchaseModel.bulkCreate(ticketObject).catch((err) => {
      throw new Error(err.message);
    });

    return res.status(201).json({
      message: "Tickets added succesfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function ticketChancesCount(req, res) {
  try {
    const today = moment(new Date()).format("YYYY-MM-DD");
    const filter = req.query.filter || "";
    console.log(filter);
    let responseObject = [];

    const ticketCountObject = await PurchaseModel.findAll({
      where: { createdAt: today },
      distinct: true,
      attributes: [
        "ticketNumber",
        "ticketPrice",
        [sequelize.fn("COUNT", "ticketNumber"), "count"],
      ],
      group: ["ticketNumber", "ticketPrice"],
      order: [["ticketPrice", "DESC"]],
      raw: true,
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err.message);
      });

    if (filter) {
      ticketCountObject.forEach((ticket) => {
        if (ticket.ticketPrice === filter) {
          responseObject.push(ticket);
        }
      });
    } else {
      responseObject = ticketCountObject;
    }

    return res.status(200).json({
      message: "Data retrived",
      data: responseObject,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function winningCalculation(req, res) {
  const [result, chalan] = PriceCalculation(["123", "23", "123"], 35, "123");
  console.log(result, chalan);
}

module.exports.purchaseTicket = purchaseTicket;
module.exports.ticketChancesCount = ticketChancesCount;
module.exports.winningCalculation = winningCalculation;
