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

let Reviews = mongoose.model("reviewsAndPhotos", reviewSchema, "reviewsAndPhotos");

let find = (callback) => {
  console.log("db.find is being called");
  Reviews.find({ review_id: 10 }).exec((err, items) => {
    callback(err, items);
  });
  // Reviews.find({ review_id: 100000 }).exec((err, items) => {
  //   callback(err, items);
  // });
};

module.exports = {
  find: find,
  // addPhotos: addPhotos,
};
