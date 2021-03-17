const express = require("express");
let app = express();
const db = require("./database");

app.use(express.json());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 1128;
}
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
