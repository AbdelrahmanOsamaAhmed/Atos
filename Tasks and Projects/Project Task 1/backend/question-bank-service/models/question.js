const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title:{type: String, required: true},
    answers:[{type: String, required: true}],
    correctAnswers:[]
  }
);
module.exports = mongoose.model("Question", questionSchema);