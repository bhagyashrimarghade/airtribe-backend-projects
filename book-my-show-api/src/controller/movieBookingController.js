const {
  City,
  Theater,
  DateModel,
  Movie,
  Show,
  User,
  Seat,
  Booking,
} = require("../models/model");
const mongoose = require("mongoose");
const moment = require("moment");

const citiesController = async (req, res, next) => {
  try {
    const cities = await City.find();
    return res.status(200).json({
      status: 200,
      msg: `cities fetched successfully`,
      data: cities,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

const theaterController = async (req, res, next) => {
  try {
    var city_id = req.params["city_id"];
    const theaters = await Theater.find({ city_id: city_id });
    if (theaters) {
      return res.status(200).json({
        status: 200,
        msg: "Theatres based on cities found successfully",
        data: theaters,
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

const showsDatesController = async (req, res, next) => {
  try {
    const theaters = await Theater.findById(req.params.theatre_id);
    if (!theaters) {
      return res.status(404).json({ status: 404, msg: "Theater not found" });
    }

    let newDate = moment(new Date()).format("YYYY-MM-DD");
    const dates = await DateModel.find({
      date: { $gte: newDate },
      theatre_id: req.params.theatre_id,
    }).limit(7);
    return res.status(200).json({
      status: 200,
      msg: "Next seven day dates fetch successfully",
      data: dates,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// Get movies for a theater on a specific date
const movieForSpecificDateController = async (req, res, next) => {
  try {
    const datePassed = new Date(req.params.date);
    const theatreIdPassed = req.params.theatre_id;
    let dateParam = moment(datePassed).format("YYYY-MM-DD");
    const movieDateFound = await DateModel.find({
      date: dateParam,
      theatre_id: theatreIdPassed,
    });
    if (movieDateFound.length === 0) {
      return res
        .status(404)
        .json({ status: 404, msg: "No movies available for given date" });
    }
    const movies = await Movie.find({
      _id: {
        $in: movieDateFound.map((date) => date.movie_id),
      },
    });

    const theaterData = await Theater.find({ _id: theatreIdPassed });

    const movieData = movieDateFound.map((md) => {
      return {
        date: md.date,
        showtimes: md.showtimes,
        movieName: movies.find((movie) => movie._id.equals(md.movie_id))
          .movie_name,
        theatreName: theaterData.find((theatre) =>
          theatre._id.equals(md.theatre_id)
        ).theater_name,
      };
    });
    return res.json({
      status: 200,
      msg: "movies fetch successfully",
      data: movieData,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

//Booking api
const bookingShowController = async (req, res, next) => {
  try {
    const { userId, showId, seatNumbers } = req.body;

    // Find the show
    const show = await Show.findById(showId).populate("theater_id");
    if (!show) {
      return res.status(404).json({ status: 404, msg: "Show not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, msg: "User not found" });
    }

    // Find the seats
    const seats = await Seat.find({
      seat_number: { $in: seatNumbers },
      theater_id: show.theater_id,
    });

    if (seats.length !== seatNumbers.length) {
      return res
        .status(404)
        .json({ status: 404, msg: "One or more seats not found" });
    }

    // Check if the seats are available
    const isSeatsAvailable = await Booking.areSeatsAvailable(
      showId,
      seats.map((seat) => seat._id)
    );
    console.log(isSeatsAvailable, "isSeatsAvailable");
    if (!isSeatsAvailable) {
      return res
        .status(400)
        .json({ status: 400, msg: "One or more seats are already booked" });
    }

    // Book the seats
    const bookings = await Booking.create(
      seats.map((seat) => ({
        user_id: user._id,
        show_id: show._id,
        seat_id: seat._id,
      }))
    );

    return res
      .status(200)
      .json({ status: 200, msg: "Bokking done successfully", data: bookings });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};
module.exports = {
  citiesController,
  theaterController,
  showsDatesController,
  movieForSpecificDateController,
  bookingShowController,
};
