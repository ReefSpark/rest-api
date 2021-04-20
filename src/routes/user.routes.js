const express = require("express");
const { searchUser, getAllUsersDropDown } = require("../services/user");
const accessTokenValidation = require("../utils/verifyToken");

const router = express.Router();

router
  .route("/users/getallusers")
  .get(accessTokenValidation, getAllUsersDropDown);

router.route("/users/search").get(accessTokenValidation, searchUser);

module.exports = router;
