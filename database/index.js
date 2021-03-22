let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Reviews");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

const reviewSchema = mongoose.Schema({
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

const characteristicSchema = mongoose.Schema({
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

let findReviews = (params, callback) => {
  const {product_id, sort, count} = params;
  console.log(count);
  if(sort === 'relevant' || sort === '"relevant"' || sort === undefined) {
    let pipeline = [
      {
        $match: {
          'product_id': Number(product_id)
        }
      }, {
        $sort: { 'date': -1, 'helpfulness': -1 },

      }, {
        $limit: Number(count) || 5
      }
    ];
    Reviews.aggregate(pipeline, (err, items) => {
      callback(err, items);
    });
  } else if (sort === 'helpfulness') {
    let pipeline = [
      {
        $match: {
          'product_id': Number(product_id)
        }
      }, {
        $sort: { 'helpfulness': -1 },

      }, {
        $limit: Number(count) || 5
      }
    ];
    Reviews.aggregate(pipeline, (err, items) => {
      callback(err, items);
    });
  } else if (sort === 'date') {
    let pipeline = [
      {
        $match: {
          'product_id': Number(product_id)
        }
      }, {
        $sort: { 'date': -1 },

      }, {
        $limit: Number(count) || 5
      }
    ];
    Reviews.aggregate(pipeline, (err, items) => {
      callback(err, items);
    });
  } else {
    Reviews.find({ product_id: product_id }).exec((err, items) => {
      callback(err, items);
    });
  }
};

let findCharacteristics = (product_id, callback) => {
  Characteristics.find({ product_id: product_id }).exec((err, items) => {
    callback(err, items);
  });
};

module.exports = {
  findReviews,
  findCharacteristics,
};
