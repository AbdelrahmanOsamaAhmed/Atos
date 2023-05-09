const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cartItemController = require("./controllers/itemControllers");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/api/items", cartItemController.getItems);
app.post("/api/items", cartItemController.addItem);

mongoose
  .connect(
    "mongodb+srv://admin-abdo:abdo1234@cluster0.svkswrm.mongodb.net/itemsDB"
  )
  .then(() => app.listen(5001));
