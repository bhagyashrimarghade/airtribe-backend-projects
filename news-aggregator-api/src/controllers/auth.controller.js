const usersValidator = require("../helpers/validator");
const registerUserInfo = require("../db/registeredUsers.json");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const {
  JWT_SECRET_KEY,
  JWT_TOKEN_EXPIRATION_TIME,
} = require("../config/env.config");

/* User Register Controller */
const registerUserController = (req, res, next) => {
  let body = req.body;

  let validatedUser = usersValidator.validateUserRegisterInfo(body);

  if (validatedUser.status) {
    let usersData = JSON.parse(JSON.stringify(registerUserInfo));

    let newUserDetails = {
      userId: 1 + usersData?.users?.length,
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 8),
      role: body.role,
      preferences: body.preferences,
      created: Date.now,
    };
    usersData?.users?.push(newUserDetails);
    try {
      fs.writeFile(
        "./src/db/registeredUsers.json",
        JSON.stringify(usersData),
        {
          encoding: "utf8",
          flag: "w",
        },
        (err, data) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              msg: `Writing users in memory failed: ${err}`,
            });
          } else {
            return res.status(500).json({
              status: 201,
              msg: `User registered successfully.`,
            });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: 500,
        msg: `Writing users in memory failed: ${error}`,
      });
    }
  } else {
    return res.status(validatedUser.statusCode).json({
      status: validatedUser.statusCode,
      msg: validatedUser.msg,
    });
  }
};

/* User Login Controller */
const loginUserController = (req, res, next) => {
  let body = req.body;
  let validatedUser = usersValidator.validateUserLoginInfo(body);
  if (validatedUser.status) {
    let accessToken = jwt.sign(
      {
        id: validatedUser.userData[0]?.userId,
        email: validatedUser.userData[0]?.email,
        userName: validatedUser.userData[0]?.userName,
      },
      JWT_SECRET_KEY,
      { expiresIn: JWT_TOKEN_EXPIRATION_TIME }
    );
    if (accessToken) {
      return res.status(200).json({
        userEmail: validatedUser.userData[0].email,
        msg: "Login successful!",
        accessToken: accessToken,
      });
    } else {
      return res.status(500).json({
        status: 500,
        msg: "Access Token generation failed! Please try again!",
      });
    }
  } else {
    return res.status(validatedUser.statusCode).json({
      status: validatedUser.statusCode,
      msg: validatedUser.msg,
    });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
};
