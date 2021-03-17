const productSchema = new Schema({
  product_id: Number,
  review_ids: [Number],
  characteristics: {
    Size: {
      id: Number,
      value: Number,
    },
    Width: {
      id: Number,
      value: Number,
    },
    Comfort: {
      id: Number,
      value: Number,
    },
    Quality: {
      id: Number,
      value: Number,
    },
  },
});
