const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Reviews');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to db');
});

const reviewSchema = mongoose.Schema({
  review_id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  rating: { type: Number, required: true },
  date: Date,
  summary: String,
  body: { type: String, required: true },
  reported: Boolean,
  recommend: { type: Boolean, required: true },
  reviewer_name: { type: String, required: true },
  reviewer_email: { type: String, required: true },
  response: String,
  helpfulness: Number,
  photos: [{ url: String }],
});

const characteristicSchema = mongoose.Schema({
  id: { type: Number, required: true },
  product_id: { type: Number, required: true },
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
  Reviews.update({ review_id: review_id }, { $inc: { helpfulness: 1 } }).exec((err, result) => {
    callback(err, result);
  });
};

const updateReported = (review_id, callback) => {
  Reviews.updateOne({ review_id: review_id }, { $set: { reported: true } }).exec((err, result) => {
    callback(err, result);
  });
};

const getLastReview = (callback) => {
  Reviews.find().sort( { review_id: -1 }).limit(1).exec((err, lastReview) => {
    callback(err, lastReview);
  });
};

const addReview = (newProduct, callback) => {
  const { product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, response, helpfulness, photos, nextReview_id} = newProduct;
  Reviews.create({
    review_id: nextReview_id,
    product_id: product_id,
    rating: rating,
    date: new Date(),
    summary: summary,
    body: body,
    reported: false,
    recommend: recommend,
    reviewer_name: reviewer_name,
    reviewer_email: reviewer_email,
    response: null,
    helpfulness: 0,
    photos: photos
  }, (err, result) => {
    callback(err, result);
  });
};

const addCharacteristics = (updatedItems, callback) => {
  //just update the values of each

  updatedItems.map(async (item) => {
    await Characteristics.updateOne(
      { id: item.id },
      {
        $set: {
          values: item.values,
        },
      },
    )
      .catch((err) => {
        callback(err);
      });
  });
  callback(null, 'you rock!');
};

module.exports = {
  findReviews,
  findCharacteristics,
  updateHelpful,
  updateReported,
  getLastReview,
  addReview,
  addCharacteristics,
};
