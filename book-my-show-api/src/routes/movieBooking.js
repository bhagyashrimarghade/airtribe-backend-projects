const movieBookingRouter = require("express").Router();
const movieBookingController = require("../controller/movieBookingController");

/** get all cities */
movieBookingRouter.get("/cities", movieBookingController.citiesController);

/** get theatres based on cities */
movieBookingRouter.get(
  "/theatre/:city_id",
  movieBookingController.theaterController
);

/**get specific theatres show details next seven days */

movieBookingRouter.get(
  "/showDates/:theatre_id",
  movieBookingController.showsDatesController
);

/**get movie for specific date */
movieBookingRouter.get(
  "/movies/:date/:theatre_id",
  movieBookingController.movieForSpecificDateController
);

movieBookingRouter.post(
  "/bookTicket",
  movieBookingController.bookingShowController
);

module.exports = movieBookingRouter;
