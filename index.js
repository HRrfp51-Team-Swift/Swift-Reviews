/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
const express = require('express');

let app = express();
const db = require('./database');

app.use(express.json());

app.get('/reviews', (req, res) => {
  // let product_id = req.query.product_id;
  const params = req.query;
  const { product_id } = params;
  console.log('someone is connecting to GET reviews for product_id', product_id);
  db.findReviews(params, (err, items) => {
    if (err) {
      console.error('errored out of db.find');
      //
    } else {
      let response = {
        product: product_id,
        page: 0,
        count: items.length,
        results: items,
      };
      console.log('success in db.find');
      res.status(200).send(response);
    }
  });
});

app.get("/reviews/meta", (req, res) => {
  let product_id = req.query.product_id;
  console.log('someone is connecting to GET metadata for ', product_id);
  const params = req.query;
  params.count = '1000000000';
  //items sorting into response logic!
  let results = {
    product_id: params.product_id,
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
  db.findReviews(params, (err1, reviews) => {
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
        //handle weird cases where it has 0 or 1 instead of true or false
        if (recommended === 0) {
          recommended = false;
        } else if (recommended === 1) {
          recommended = true;
        }
        results.recommended[`${recommended}`]++;
      }

      db.findCharacteristics(product_id, (err2, items) => {
        if (err2) {
          console.error('errored out of the db.findCharacteristics');
        } else {
          //loop through items
          for (let i = 0; i < items.length; i++) {
            //check items[i].name
            let charName = items[i].name;
            //if results[i].name === undefined
            if (results.characteristics[charName] === undefined) {
              //set the name in results
              results.characteristics[charName] = {};
              // console.log(items[i].id)

              // results.characteristics[charName].id = items[i].id;
              // results.characteristics[results[i].name].id = results[i].name
            }
            let values = items[i].values;
            let valuesTotal = 0;
            //let valuesCount = items[i].values.length
            const valuesCount = values.length;
            //loop through items[i].values
            for (let j = 0; j < values.length; j++) {
              //increment total by items[i].values[j].value
              valuesTotal += values[j].value;
            }
            //after loop, get average and set characteristics[results[i].name].value = avg
            results.characteristics[charName].id = items[i].id;
            results.characteristics[charName].value = valuesTotal / valuesCount;
          }
          console.log('success in db.findCharacteristics!');
          res.status(200).send(results);
        }
      });
    }
  });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log('someone is connecting to PUT helpfulness for review', req.params.review_id);
  console.log(req.params)
  db.updateHelpful(req.params.review_id, (err, result) => {
    if (err) {
      console.error(err);
      res.status(304).send(err);
    } else {
      res.status(202).send(result);
    }
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  console.log('someone is connecting to PUT reported for review', req.params.review_id);
  console.log(req.params);
  db.updateReported(req.params.review_id, (err, result) => {
    if (err) {
      console.error(err);
      res.status(304).send(err);
    } else {
      res.status(202).send(result);
    }
  });
});

app.post('/reviews', (req, res) => {
  console.log('in post new review request')
  const params = req.body;
  //get new review_id at the start
  db.getLastReview((err, lastReview) => {
    params.nextReview_id = lastReview[0].review_id + 1;
    //get characteristicsAndValues entry for product_id and names
    db.findCharacteristics(params.product_id, (err, items) => {
      //check that number of chars is same on both
      //if not exit, error out
      if (items.length !== Object.keys(params.characteristics).length) {
        //error out
        res.status(400).end();
      } else {
        //loop through items[i].id
        for (let i = 0; i < items.length; i++) {
          //if it matches an incoming params.characteristics[items[i].id]
          if (params.characteristics[items[i].id]) {
            //push onto that array
            let newChar = {
              characteristic_id: items[i].id,
              review_id: params.nextReview_id,
              value: params.characteristics[items[i].id],
            };
            items[i].values.push(newChar);
          }
        }
      }
      //items are ready!!!!!!!!!!
      console.log(items)
      db.addCharacteristics(items, (err2, results) => {
        if (err) {
          console.error(err2);
        } else {
          console.log('successfully added characteristics in a promise all maybe')
          db.addReview(params, (err3, result) => {
            if (err) {
              console.error(err3);
              res.status(406).send(err3);
            } else {
              //review added
              console.log('in success route for add reviews')
              console.log(result);
              res.status(201).send(result);
            }
          });
        }
      });
      //update each entry values field with new values

    });

  })
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 1128;
}
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
