const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DentistSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
    require: true,
    trim: true,
  },
  dentists: {
    type: Number,
  },
  address: {
    type: String,
    require: true,
    trim: true,
  },
  city: {
    type: String,
    require: true,
  },
  coordinates: {
    longitude: Number,
    latitude: Number,
  },
  openingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
  },
  Appointment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

module.exports = mongoose.model("Dentist", DentistSchema);
