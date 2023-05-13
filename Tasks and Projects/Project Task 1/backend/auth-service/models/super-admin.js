const User = require("./user");
const mongoose = require("mongoose");

module.exports = User.discriminator("SUPER_ADMIN", {
  createdAdmins: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});
