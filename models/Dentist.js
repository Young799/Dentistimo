const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema({
  name: String,
  email: String,
  
});

module.exports = mongoose.model("Dentist", DentistSchema);
