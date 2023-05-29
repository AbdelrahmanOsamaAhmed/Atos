const User = require("./user");
module.exports = User.discriminator("STUDENT", {
  examInstances: [{ type: Number }],
});
