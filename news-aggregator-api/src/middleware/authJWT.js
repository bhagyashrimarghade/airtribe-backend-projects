const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/env.config");

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      JWT_SECRET_KEY,
      function (err, decode) {
        if (err) {
          req.user = null;
          req.msg = "Header verification failed, some issue with token";
        } else {
          req.user = decode.id;
          req.msg = "User found successfully";
        }
        next();
      }
    );
  } else {
    req.user = null;
    req.msg = "Authorization header not found";
    next();
  }
};

module.exports = verifyToken;
