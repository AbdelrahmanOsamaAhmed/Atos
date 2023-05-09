const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cartItemController = require("./controllers/cartItemControllers");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/api/cart", cartItemController.getItems);
app.post("/api/cart", cartItemController.addItem);

mongoose
  .connect(
    "mongodb+srv://admin-abdo:abdo1234@cluster0.svkswrm.mongodb.net/cartDB"
  )
  .then(() => app.listen(5000));
