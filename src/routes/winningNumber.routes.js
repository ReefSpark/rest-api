const express = require("express");
const { addWinningNumber } = require("../services/winningNumber");
const accessTokenValidation = require("../utils/verifyToken");

const router = express.Router();

router.route("/winningnumber").post(accessTokenValidation, addWinningNumber);

module.exports = router;
