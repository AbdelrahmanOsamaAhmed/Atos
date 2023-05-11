const mongoose = require("mongoose");
const User = require("./user");
module.exports = User.discriminator("TEACHER", {
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
});
