const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");
const questionRoutes = require("./routes/questions-routes");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);

app.use((req, res, next) => {
  return next(new HttpError("This routing is not available", 404));
});
app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
mongoose.connect(
  "mongodb+srv://admin-abdo:abdo1234@cluster0.svkswrm.mongodb.net/questionBankDB"
);

app.listen(5001, () => console.log("listening on port 5001"));
