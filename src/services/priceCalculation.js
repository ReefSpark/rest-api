const moment = require("moment");

const WinningNumberModel = require("../models/WinningNumbers");
const PurchaseTicketModel = require("../models/purchaseTicket");
const { PriceCalculation: priceAlgo } = require("../utils/priceCalculation");

async function calculateWinningPrice(req, res) {
  try {
    const user = req.query.user || "";
    const userTicketObject = {};
    const today = moment(new Date()).format("YYYY-MM-DD");

    const winningNumber = await WinningNumberModel.findOne({
      where: { date: today },
      raw: true,
    })
      .then((onfulfilled) => {
        return onfulfilled.winningNumbers;
      })
      .catch((err) => {
        throw new Error(err.name);
      });

    await PurchaseTicketModel.findAll({
      raw: true,
      where: { customer: user, createdAt: today },
    })
      .then((onfulfilled) => {
        onfulfilled.forEach((userTicket) => {
          if (userTicketObject[userTicket.ticketPrice]) {
            userTicketObject[userTicket.ticketPrice].ticketNumbers.push(
              userTicket.ticketNumber
            );
          } else {
            userTicketObject[userTicket.ticketPrice] = {
              ticketNumbers: [userTicket.ticketNumber],
              winningNumber: winningNumber[userTicket.ticketPrice],
              sellingPrice: userTicket.sellingPrice,
            };
          }
        });
      })
      .catch((err) => {
        throw new Error(err.name);
      });

    const tickets = Object.keys(userTicketObject);

    for (let i = 0; i < tickets.length; i++) {
      const element = tickets[i];

      const [result] = priceAlgo(
        userTicketObject[element].ticketNumbers,
        element,
        userTicketObject[element].winningNumber
      );
      userTicketObject[element]["winningAmount"] = result;

      userTicketObject[element]["quantity"] =
        userTicketObject[element].ticketNumbers.length;

      userTicketObject[element]["purchaseAmount"] =
        parseInt(userTicketObject[element]["quantity"]) *
        parseInt(userTicketObject[element]["sellingPrice"]);
    }

    let totalWinningAmount = 0;
    let totalPurchaseAmount = 0;

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      userObj = userTicketObject[ticket];

      totalWinningAmount = totalWinningAmount + parseInt(userObj.winningAmount);
      totalPurchaseAmount =
        totalPurchaseAmount + parseInt(userObj.purchaseAmount);
    }

    userTicketObject["totalWinningAmount"] = totalWinningAmount;
    userTicketObject["totalPurchaseAmount"] = totalPurchaseAmount;
    userTicketObject["user"] = user;

    return res.status(200).json({
      message: userTicketObject,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports.calculateWinningPrice = calculateWinningPrice;
