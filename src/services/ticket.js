const joi = require("@hapi/joi");
const _ = require("lodash");

const AgentModel = require("../models/Agents");
const TicketModel = require("../models/Tickets");

async function addTicket(req, res) {
  const schema = joi.object({
    ticketName: joi.string().required(),
    price: joi.number().required(),
  });

  const reqValidation = schema.validate(req.body);

  if (reqValidation.error) {
    return res.status(400).json({
      message: reqValidation.error.details[0].message,
    });
  }

  try {
    const ticketName = req.body.ticketName;
    const price = req.body.price;
    const username = req.user.user;

    const user = await AgentModel.findOne({
      where: { userName: username },
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err);
      });

    TicketModel.create(
      {
        ticketName: ticketName,
        price: price,
        user: user.getDataValue("userName"),
      },
      { raw: true }
    )
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "Ticket created",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
}

async function getAllTicket(req, res) {
  try {
    const tickets = await TicketModel.findAll({
      raw: true,
      order: [["price", "DESC"]],
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err);
      });

    let result = _.map(tickets, (ticket) =>
      _.pick(ticket, ["id", "ticketName", "price", "user", "updatedAt"])
    );

    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
}

async function editTicket(req, res) {
  const schema = joi.object({
    ticketName: joi.string().required(),
    price: joi.number().required(),
  });

  const reqValidation = schema.validate(req.body);

  if (reqValidation.error) {
    return res.status(500).json({
      success: false,
      message: reqValidation.error.details[0].message,
    });
  }
  try {
    const ticketName = req.body.ticketName;
    const price = req.body.price;
    const ticketId = req.params.id;
    const username = req.user.user;

    const user = await AgentModel.findOne({
      where: { userName: username },
    })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err);
      });

    const ticket = await TicketModel.findOne({ id: ticketId })
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err,
        });
      });

    ticket.ticketName = ticketName;
    ticket.price = price;
    ticket.user = user.getDataValue("userName");
    ticket.save();

    return res.status(201).json({
      success: true,
      message: "Ticket has been updated.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
}

module.exports.addTicket = addTicket;
module.exports.getAllTicket = getAllTicket;
module.exports.editTicket = editTicket;
