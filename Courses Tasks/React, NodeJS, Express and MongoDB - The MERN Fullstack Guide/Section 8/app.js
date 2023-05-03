const express = require("express");
const bodyParser = require("body-parser");
const mongoosePractice = require("./mongoose");

const app = express();

app.use(bodyParser.json());

app.post("/products", mongoosePractice.createProduct);

app.get("/products", mongoosePractice.getProducts);

app.listen(3000);
