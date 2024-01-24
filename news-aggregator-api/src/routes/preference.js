const newsAggregatorRoutes = require("express").Router();

const newsAggregatorController = require("../controllers/newsAggregator.controller");

const verifyToken = require("../middleware/authJWT");

newsAggregatorRoutes.get(
  "/preferences",
  verifyToken,
  newsAggregatorController.getUsersNewsPreferencesController
);

newsAggregatorRoutes.put(
  "/preferences",
  verifyToken,
  newsAggregatorController.updateUsersNewsPreferencesController
);

newsAggregatorRoutes.get(
  "/newspreferences",
  verifyToken,
  newsAggregatorController.getNewsBasisPreferencesController
);

module.exports = newsAggregatorRoutes;
