let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Reviews");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

let reviewSchema = mongoose.Schema({
  review_id: Number,
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  reported: Boolean,
  recommend: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number,
  photos: [{ url: String }],
});

let characteristicSchema = mongoose.Schema({
  id: Number,
  product_id: Number,
  name: String,
  values: [{
    id: Number,
    characteristic_id: Number,
    review_id: Number,
    value: Number,
  }],
});

let Reviews = mongoose.model("reviewsAndPhotos", reviewSchema, "reviewsAndPhotos");
let Characteristics = mongoose.model("characteristicsAndValues", characteristicSchema, "characteristicsAndValues");

let find = (product_id, callback) => {
  console.log("db.find is being called");
  let queryArray = [product_id];
  Reviews.find({ product_id: product_id }).exec((err, items) => {
    callback(err, items);
  });
  // Reviews.find({ review_id: 100000 }).exec((err, items) => {
  //   callback(err, items);
  // });
};

let findCharacteristics = (product_id, callback) => {
  console.log("db.findCharacteristics is being called");
  Characteristics.find({ product_id: product_id }).exec((err, items) => {
    callback(err, items);
  });
};

module.exports = {
  find: find,
  findCharacteristics: findCharacteristics,
};