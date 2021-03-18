/* eslint-disable quotes */
/* eslint-disable spaced-comment */

//creating index. key is what to index on, value is 1 or -1, ascending or descending
db.reviews.createIndex( { "id": 1 } )
//look at indexes
db.collection.getIndexes()
//get rid of indexes
db.collection.dropIndex()

//rename all of the field names in a collection
db.reviews.updateMany( {}, { $rename: { 'id': 'review_id' } })
//set up a pipeline for an aggregate call
//pipeline for reviews and reviews_photos
pipeline = [{ $lookup: { from: "reviews_photos", localField: "id", foreignField: "review_id", as: "photos" } }, { $out : "reviewsAndPhotos" } ]

//the actual aggregate call. there are a lot of options for the 2nd param
db.reviews.aggregate(pipeline, { allowDiskUse : true } )

Pipeline plan for characteristics

  1.
    //pipeline for characteristics and characteristic_reviews
      pipeline = [{ $lookup: { from: "characteristic_reviews", localField: "id", foreignField: "characteristic_id", as: "valuesArr" } }, { $out : "charCombined" } ]
      { allowDiskUse : true }

      //the actual aggregate call. there are a lot of options for the 2nd param
      db.characteristics.aggregate(pipeline, { allowDiskUse : true } )

      //this worked on sample data. remember to index before real data
  2.
    //add a new field onto each, using valuesArr
      //review_id = valuesArr[3]
      //value = valuesArr[4]
      db.reviews.updateMany( {}, {} )


