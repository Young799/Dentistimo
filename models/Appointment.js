const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  name: { type: String },
  start: { type: String },
  end: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist" },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
