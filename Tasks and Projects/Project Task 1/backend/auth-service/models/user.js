const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, require: true, unique: true, dropDups: true },
  password: { type: String, require: true, minLength: 6 },
  userType: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
