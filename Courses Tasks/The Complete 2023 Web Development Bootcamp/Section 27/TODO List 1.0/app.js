//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var today = new Date();
var items = ['play','sleep'];

var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
var currentDay = today.toLocaleDateString("en-US", options);

app.get("/", function (req, res) {
  res.render("list", { day: currentDay, newListItems: items });
});
app.post("/", (req, res) => {
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
