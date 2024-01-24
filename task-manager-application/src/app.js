const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { type } = require("os");
let writePath = path.join(__dirname, "./tasks/", "tasks.json");
const tasks = require("./routes/tasks");

let port = 3000;

app.use(express.json());

app.use("/tasks", tasks);

app.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on port ${port}`);
  } else {
    console.log("some error encountered");
  }
});
