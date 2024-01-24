const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const rateLimit = require("express-rate-limit");

app.use(bodyParser.json());

let port = 3000;

var morgan = require("morgan");
var path = require("path");
var rfs = require("rotating-file-stream"); // version 2.x

const authRouter = require("./routes/auth");
const newsAggregatorRoutes = require("./routes/preference");

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
// setup the logger
app.use(
  morgan(
    ":remote-addr - :remote-user [:date[web]] ':method :url HTTP/:http-version' :status :res[content-length] ':referrer' ':user-agent",
    { stream: accessLogStream }
  )
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

app.use(limiter);

//User login and register
app.use("/auth", authRouter);

//Preferences
app.use("/users", newsAggregatorRoutes);

app.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on port ${port}`);
  } else {
    console.log("some error encountered");
  }
});
