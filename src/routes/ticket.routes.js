const express = require("express");
const { addTicket, getAllTicket, editTicket } = require("../services/ticket");
const accessTokenValidation = require("../utils/verifyToken");

const router = express.Router();

router.route("/ticket/addticket").post(accessTokenValidation, addTicket);
router.route("/ticket/editticket").patch(accessTokenValidation, editTicket);
router.route("/ticket/getallticket").get(accessTokenValidation, getAllTicket);

module.exports = router;
