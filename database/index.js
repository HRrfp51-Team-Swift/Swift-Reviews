const mongoose = require("mongoose");
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

const Reviews = mongoose.model('reviewsAndPhotos', reviewSchema, 'reviewsAndPhotos');
const Characteristics = mongoose.model('characteristicsAndValues', characteristicSchema, 'characteristicsAndValues');

const findReviews = (params, callback) => {
  const { product_id, sort, count } = params;
  // if (sort === 'relevant') {
  if (sort === 'relevant' || sort === '"relevant"' || sort === undefined) {
    const pipeline = [
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
    const pipeline = [
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
    const pipeline = [
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
    Reviews.find({ product_id: product_id }).lean().exec((err, items) => {
      callback(err, items);
    });
  }
};

const findCharacteristics = (product_id, callback) => {
  Characteristics.find({ product_id: product_id }).exec((err, items) => {
    callback(err, items);
  });
};

const updateHelpful = (review_id, callback) => {
  // Reviews.find({ review_id: review_id }).exec((err, result) => {
  //   console.log(review[0])
  //   callback(err, result)
  // })

  Reviews.update({ review_id: review_id }, { $inc: { helpfulness: 1 } }).exec((err, result) => {
    callback(err, result);
  });
};

const updateReported = (review_id, callback) => {
  // Reviews.find({ review_id: review_id }).exec((err, result) => {
  //   console.log(review[0])
  //   callback(err, result)
  // })

  Reviews.update({ review_id: review_id }, { $set: { reported: true } }).exec((err, result) => {
    callback(err, result);
  });
};

const addReview = () => {

}

module.exports = {
  findReviews,
  findCharacteristics,
  updateHelpful,
  updateReported,
  addReview,
};
