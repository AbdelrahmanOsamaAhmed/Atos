const User = require("./user");
const mongoose = require("mongoose");

module.exports = User.discriminator("ADMIN", {});
