// models.js
const mongoose = require("mongoose");
const moment = require("moment");

const citySchema = new mongoose.Schema({
  city_name: { type: String, required: true },
});

const theaterSchema = new mongoose.Schema({
  theater_name: { type: String, required: true },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
});

const seatSchema = new mongoose.Schema({
  seat_number: { type: String, required: true },
  theater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true,
  },
  show_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true,
  },
});

const showSchema = new mongoose.Schema({
  show_name: { type: String, required: true },
  theater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
  date: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DateModel",
    required: true,
  },
});

const movieSchema = new mongoose.Schema({
  movie_name: { type: String, required: true },
});

const showtimeSchema = new mongoose.Schema({
  time: { type: String, required: true },
});

const dateSchema = new mongoose.Schema({
  date: { type: String, required: true, default: Date },
  showtimes: [showtimeSchema],
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  theatre_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true,
  },
});

bookingSchema.statics.areSeatsAvailable = async function (showId, seatIds) {
  // Count the number of bookings for the specified seats in the given show
  const bookedSeatsCount = await this.countDocuments({
    show_id: showId,
    seat_id: { $in: seatIds },
  });

  // If the count is 0, seats are available; otherwise, they are booked
  return bookedSeatsCount === 0;
};

bookingSchema.index({ show_id: 1, seat_id: 1, user_id: 1 });

const City = mongoose.model("City", citySchema);
const Theater = mongoose.model("Theater", theaterSchema);
const Seat = mongoose.model("Seat", seatSchema);
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Show = mongoose.model("Show", showSchema);
const Movie = mongoose.model("Movie", movieSchema);
const DateModel = mongoose.model("DateModel", dateSchema);

async function insertSampleData() {
  try {
    const cityData = await City.create([
      {
        city_name: "Nagpur",
      },
      {
        city_name: "Bhandara",
      },
      {
        city_name: "Amravati",
      },
    ]);

    const theaterData = await Theater.create([
      { theater_name: "CinePolice", city_id: cityData[0]._id },
      { theater_name: "AM Cinema Manish Nagar", city_id: cityData[0]._id },
      { theater_name: "AM Cinema Jayprakash Nagar", city_id: cityData[0]._id },
      { theater_name: "Iternity Mall", city_id: cityData[0]._id },
      { theater_name: "Adarsh", city_id: cityData[1]._id },
    ]);

    // Insert sample seats
    const seatData = await Seat.create([
      { seat_number: "A1", theater_id: theaterData[0]._id },
      { seat_number: "B1", theater_id: theaterData[0]._id },
      { seat_number: "C1", theater_id: theaterData[0]._id },
      { seat_number: "A1", theater_id: theaterData[1]._id },
      { seat_number: "B1", theater_id: theaterData[1]._id },
      { seat_number: "C1", theater_id: theaterData[1]._id },
      { seat_number: "A1", theater_id: theaterData[2]._id },
      { seat_number: "B1", theater_id: theaterData[2]._id },
      { seat_number: "A1", theater_id: theaterData[3]._id },
      { seat_number: "A1", theater_id: theaterData[4]._id },
    ]);

    // Insert sample users
    const userData = await User.create([
      { username: "Shree" },
      { username: "Bhagyaj" },
      { username: "Jay Shree Ram" },
    ]);

    // Insert sample movies
    const movieData = await Movie.create([
      { movie_name: "Udan" },
      { movie_name: "12th Fail" },
      { movie_name: "NH 47" },
      { movie_name: "Rabta" },
      { movie_name: "Chhichhore" },
    ]);

    // Insert sample showtimes
    const showtimeData = [
      { time: "12:00 PM" },
      { time: "3:00 PM" },
      { time: "6:00 PM" },
    ];

    // Insert sample dates with showtimes and movies

    let newDate = moment(new Date()).format("YYYY-MM-DD");
    const dateData = await DateModel.create([
      {
        date: newDate,
        showtimes: showtimeData,
        movie_id: movieData[0]._id,
        theatre_id: theaterData[0]._id,
      },
      {
        date: newDate,
        showtimes: showtimeData,
        movie_id: movieData[1]._id,
        theatre_id: theaterData[1]._id,
      },
      {
        date: newDate,
        showtimes: showtimeData,
        movie_id: movieData[2]._id,
        theatre_id: theaterData[2]._id,
      },
      {
        date: newDate,
        showtimes: showtimeData,
        movie_id: movieData[3]._id,
        theatre_id: theaterData[3]._id,
      },
      {
        date: newDate,
        showtimes: showtimeData,
        movie_id: movieData[4]._id,
        theatre_id: theaterData[4]._id,
      },
      {
        date: newDate,
        showtimes: showtimeData,
        movie_id: movieData[0]._id,
        theatre_id: theaterData[0]._id,
      },
    ]);

    // Insert sample shows
    const showData = await Show.create([
      {
        show_name: "Show A",
        theater_id: theaterData[0]._id,
        date: dateData[0]._id,
      },
      {
        show_name: "Show B",
        theater_id: theaterData[1]._id,
        date: dateData[1]._id,
      },
      {
        show_name: "Show B",
        theater_id: theaterData[2]._id,
        date: dateData[1]._id,
      },
      {
        show_name: "Show A",
        theater_id: theaterData[3]._id,
        date: dateData[1]._id,
      },
      {
        show_name: "Show A",
        theater_id: theaterData[4]._id,
        date: dateData[1]._id,
      },
    ]);

    // Insert sample bookings
    const bookingData = await Booking.create([
      {
        user_id: userData[0]._id,
        seat_id: seatData[0]._id,
        show_id: showData[0]._id,
      },
      {
        user_id: userData[1]._id,
        seat_id: seatData[1]._id,
        show_id: showData[1]._id,
      },

      {
        user_id: userData[2]._id,
        seat_id: seatData[1]._id,
        show_id: showData[2]._id,
      },
      {
        user_id: userData[0]._id,
        seat_id: seatData[1]._id,
        show_id: showData[3]._id,
      },
    ]);
    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  } finally {
    // Close the MongoDB connection when done
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}
insertSampleData();

module.exports = { City, Theater, Seat, User, Booking, Show, Movie, DateModel };
