const jwt = require("jsonwebtoken");

function accessTokenValidation(req, res, next) {
  try {
    if (!process.env.JWT_ACCESS_KEY)
      return res.status(401).json({
        message: "Contact Administrator if the Issue persists",
      });

    const accessToken = req.header("Bearer-Token");
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              message: "Access Token Expired",
            });
          }

          return res.status(401).json({
            message: "Access Denied",
          });
        }

        if (decoded) {
          req.user = {
            user: decoded.user,
            admin: decoded.admin,
          };
          next();
        }
      });
    } else {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      errCode: err.errno,
      info: SOMETHING_WRONG_ERROR,
    });
  }
}

module.exports = accessTokenValidation;
