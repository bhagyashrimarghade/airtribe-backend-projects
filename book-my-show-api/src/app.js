// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const moviesRouter = require("./routes/movieBooking");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1/bookmyshow");
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

//User login and register
app.use("/api/v1/", moviesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
