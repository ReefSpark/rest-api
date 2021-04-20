const { Op } = require("sequelize");
const UserModel = require("../models/Users");

async function searchUser(req, res) {
  try {
    const searchString = req.query.search;

    const filter = {
      raw: true,
      order: [["customerName", "ASC"]],
      where: { fullName: { [Op.like]: `%${searchString}%` } },
    };

    const searchResult = await UserModel.findAll(filter)
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err.toString());
      });

    return res.status(200).json({
      success: true,
      message: searchResult,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
}

async function getAllUsersDropDown(req, res) {
  try {
    const filter = {
      raw: true,
      order: [["customerName", "ASC"]],
      attributes: ["customerName"],
    };

    const userData = await UserModel.findAll(filter)
      .then((onfulfilled) => {
        return onfulfilled;
      })
      .catch((err) => {
        throw new Error(err.toString());
      });

    return res.status(200).json({
      status: true,
      message: userData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
}

module.exports.searchUser = searchUser;
module.exports.getAllUsersDropDown = getAllUsersDropDown;
