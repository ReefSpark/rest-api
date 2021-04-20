const express = require("express");
const {
  purchaseTicket,
  ticketChancesCount,
  winningCalculation,
} = require("../services/purchaseTicket");
const accessTokenValidation = require("../utils/verifyToken");

const router = express.Router();

router.route("/purchaseticket").post(accessTokenValidation, purchaseTicket);
router
  .route("/purchaseticket/ticketchancecount")
  .get(accessTokenValidation, ticketChancesCount);
router.route("/winningcalculation").get(winningCalculation);

module.exports = router;
