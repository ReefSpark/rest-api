const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const _ = require("lodash");

const AgentsModel = require("../models/Agents");
const { generateAccessToken } = require("../utils/jwt");

async function AgentRegistration(req, res) {
  const schema = joi.object({
    firstname: joi.string().required(),
    lastname: joi.string(),
    username: joi.string().min(5).max(15).required(),
    password: joi.string().min(7).max(15).required(),
    mobilenumber: joi.string().min(10).max(12).required(),
    mail: joi.string().email().required(),
  });

  const reqValidation = schema.validate(req.body);

  if (reqValidation.error) {
    return res.status(400).json({
      success: false,
      message: reqValidation.error.details[0].message,
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    console.log("password", password);

    const AgentsData = {
      firstName: req.body.firstname,
      lastName: req.body.lastname || "",
      userName: req.body.username,
      password: password,
      mobileNumber: req.body.mobilenumber,
      mail: req.body.mail,
    };

    AgentsModel.create(AgentsData)
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "Agent created successfully",
        });
      })
      .catch((err) => {
        if (err.message === "Validation error") {
          return res.status(500).json({
            success: false,
            message:
              "User with email or mobilenumber or username already exsist",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: err.toString(),
          });
        }
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
}

async function AgentLogin(req, res) {
  const schema = joi.object({
    username: joi.string().min(5).max(15).required(),
    password: joi.string().min(7).max(15).required(),
  });

  const reqValidation = schema.validate(req.body);

  if (reqValidation.error) {
    return res.status(400).json({
      success: false,
      message: reqValidation.error.details[0].message,
    });
  }

  try {
    const username = req.body.username;
    const password = req.body.password;

    let filter = {
      raw: true,
      where: { [Op.and]: [{ userName: username }] },
    };

    const user = await AgentsModel.findOne(filter);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "username or password provided is wrong.",
      });
    }

    let match = await bcrypt.compare(password, user.password);

    if (match === false) {
      return res.status(401).json({
        success: false,
        message: "username or password provided is wrong.",
      });
    }

    let tokenData = _.pick(user, ["userName", "isAdmin"]);
    const accessToken = generateAccessToken(
      tokenData,
      process.env.JWT_ACCESS_KEY
    );

    res.setHeader("x-auth-token", accessToken.token);
    return res.status(200).json({
      success: true,
      message: "Logged in",
      user: tokenData,
      token: accessToken.token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
}

async function me(req, res) {
  try {
    const username = req.user.user;

    let filter = {
      raw: true,
      where: { [Op.and]: [{ userName: username }] },
    };

    const user = await AgentsModel.findOne(filter);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exists",
      });
    }

    const userDetails = _.pick(user, [
      "userName",
      "firstName",
      "lastName",
      "mail",
      "mobileNumber",
    ]);

    return res.status(200).json({
      success: true,
      message: userDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
}

module.exports.AgentRegistration = AgentRegistration;
module.exports.AgentLogin = AgentLogin;
module.exports.me = me;
