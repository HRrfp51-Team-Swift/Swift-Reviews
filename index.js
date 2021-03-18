const express = require("express");

let app = express();
const db = require("./database");

app.use(express.json());

app.get("/reviews", (req, res) => {
  // console.log(req.body)
  console.log("someone is connecting to GET reviews for product_id");
  db.find((err, items) => {
    if (err) {
      console.error("errored out of db.find");
    } else {
      console.log("success in db.find");
      console.log(items);
      res.status(200).send(items);
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 1128;
}
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
