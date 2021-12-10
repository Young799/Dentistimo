const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  name: {type: String},
  start: { type: String },
  end: {type: String},
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    rquired: true,
  },
  Dentist: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist" },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
