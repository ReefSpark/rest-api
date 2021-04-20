const joi = require("@hapi/joi");
const moment = require("moment");

const AgentModel = require("../models/Agents");
const WinningNumberModel = require("../models/WinningNumbers");

async function addWinningNumber(req, res) {
  const schema = joi.object({
    date: joi.string().min(10).required(),
    ticketWinningNumbers: joi.object().required(),
  });

  let reqValidation = schema.validate(req.body);

  if (reqValidation.error) {
    return res.status(400).json({
      success: false,
      message: reqValidation.error.details[0].message,
    });
  }

  try {
    const date = req.body.date;
    const ticketWinningNumbers = req.body.ticketWinningNumbers;

    const todayDateObject = moment(date).format("YYYY-MM-DD");

    const agent = await AgentModel.findOne({
      where: { userName: req.user.user },
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err);
      });

    const winningNumber = await WinningNumberModel.create({
      date: todayDateObject,
      winningNumbers: ticketWinningNumbers,
      agent: agent.getDataValue("userName"),
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err.name);
      });

    return res.status(201).json({
      success: true,
      message: "Winning numbers added successfully",
      data: winningNumber,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports.addWinningNumber = addWinningNumber;
