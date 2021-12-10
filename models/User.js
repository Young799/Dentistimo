const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  Fname: { type: String },
  Lname: {type: String},
  id: {type: String},
  email: {type: String},
  password: {type: String}
});

module.exports = mongoose.model("User", UserSchema);
