const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/bmicalculator.html");
});
app.post("/bmicalculator", (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);
  res.send("Your BMI is: " + (weight / (height * height)).toPrecision(4));
});
app.listen(3000, () => console.log("listening on 3000"));
