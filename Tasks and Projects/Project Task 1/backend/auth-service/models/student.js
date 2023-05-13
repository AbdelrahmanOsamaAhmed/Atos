const User = require("./user");
module.exports = User.discriminator("STUDENT", {
  subjects: [{ type: String }],
});
