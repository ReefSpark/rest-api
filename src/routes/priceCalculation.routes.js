const express = require("express");
const { calculateWinningPrice } = require("../services/priceCalculation");
const accessTokenValidation = require("../utils/verifyToken");

const router = express.Router();

router
  .route("/pricecalculation")
  .get(accessTokenValidation, calculateWinningPrice);

module.exports = router;
