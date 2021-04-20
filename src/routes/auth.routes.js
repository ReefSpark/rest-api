const express = require("express");
const { AgentRegistration, AgentLogin, me } = require("../services/auth");

const accessTokenValidation = require("../utils/verifyToken");
const router = express.Router();

router.route("/auth/register").post(AgentRegistration);
router.route("/auth/login").post(AgentLogin);
router.route("/auth/me").get(accessTokenValidation, me);

module.exports = router;
