const express = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = express.Router();

/** user register route */
authRouter.post("/register", authController.registerUserController);

/**user login */
authRouter.post("/login", authController.loginUserController);

module.exports = authRouter;
