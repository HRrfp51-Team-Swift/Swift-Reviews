const express = require("express");

let app = express();
const db = require("./database");

app.use(express.json());

app.get("/reviews", (req, res) => {
  let product_id = req.query.product_id;
  console.log("someone is connecting to GET reviews for product_id", product_id);
  db.findReviews(product_id, (err, items) => {
    if (err) {
      console.error("errored out of db.find");
    } else {
      let response = {
        product: product_id,
        page: 0,
        count: 5,
        results: items,
      };
      console.log("success in db.find");
      // console.log(items);
      res.status(200).send(response);
    }
  });
});

app.get("/metadata", (req, res) => {
  let product_id = req.query.product_id;
  console.log("someone is connecting to GET metadata for ", product_id);

  //items sorting into response logic!
  let results = {
    product_id: product_id,
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    recommended: {
      false: 0,
      true: 0,
    },
    characteristics: {},
  };

  //get all reviews by id
  db.findReviews(product_id, (err1, reviews) => {
    if (err1) {
      console.error(err);
    } else {
      //loop reviews
      for (let i = 0; i < reviews.length; i++) {
        // - increment totals of results.ratings[reviews[i].rating]
        let rating = reviews[i].rating;
        results.ratings[rating]++;
        // - also incremented results.recommended[reviews[i].recommend] (true or false)
        let recommended = reviews[i].recommend;
        results.recommended[`${recommended}`]++;
      }

      db.findCharacteristics(product_id, (err2, items) => {
        if (err2) {
          console.error("errored out of the db.findCharacteristics");
        } else {
          //loop through items
          for (let i = 0; i < items.length; i++) {
            //check items[i].name
            let charName = items[i].name;
            //if results[i].name === undefined
            if (results.characteristics[charName] === undefined) {
              //set the name in results
              results.characteristics[charName] = {};
              //results.characteristics[results[i].name].id = results[i].name
            }
            let values = items[i].values;
            let valuesTotal = 0;
            //let valuesCount = items[i].values.length
            let valuesCount = values.length;
            //loop through items[i].values
            for (let j = 0; j < values.length; j++) {
              //increment total by items[i].values[j].value
              valuesTotal += values[j].value;
            }
            //after loop, get average and set characteristics[results[i].name].value = avg
            results.characteristics[charName] = valuesTotal / valuesCount;
          }
          console.log("success in db.findCharacteristics!");
          res.status(200).send(results);
        }
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 1128;
}
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
