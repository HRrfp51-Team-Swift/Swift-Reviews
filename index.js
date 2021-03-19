const express = require("express");

let app = express();
const db = require("./database");

app.use(express.json());

app.get("/reviews", (req, res) => {
  let product_id = req.query.product_id;
  console.log("someone is connecting to GET reviews for product_id", product_id);
  db.find(product_id, (err, items) => {
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
  db.findCharacteristics(product_id, (err, items) => {
    if(err) {
      console.error("errored out of the db.findCharacteristics");
    } else {
      console.log("success in db.findCharacteristics!");
      res.status(200).send(items);
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
