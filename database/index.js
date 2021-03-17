let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Reviews");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

module.exports = {};
