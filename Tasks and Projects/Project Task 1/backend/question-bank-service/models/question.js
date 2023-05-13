const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  mark: { type: Number, required: true },
  expectedTime: { type: Number, required: true },
  createdBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, required: true },
  answers: [
    {
      description: { type: String, required: true },
    },
  ],
  correctAnswers: [
    {
      description: { type: String, required: true },
    },
  ],
});
module.exports = mongoose.model("Question", questionSchema);
