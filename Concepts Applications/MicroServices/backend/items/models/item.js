const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});
module.exports = mongoose.model("Item", cartItemSchema);
