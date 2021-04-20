const jwt = require("jsonwebtoken");

function generateAccessToken(user, secret) {
  let dataStoredInToken = {
    user: user.userName,
    admin: user.isAdmin,
  };
  let expiresIn = process.env.JWT_ACCESS_TOKEN_LIFETIME;
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
}

module.exports.generateAccessToken = generateAccessToken;
