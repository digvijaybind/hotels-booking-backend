const Mongoose = require("mongoose");

const OperatorSchema = new Mongoose.Schema({
  hotel_name: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  country_name: {
    type: String,
    required: true,
  },
  hotelOwner: [
    {
      aircraftOperator: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "AircraftOperatorSchema",
      },
      Hotel_type: String,
      Tail_sign: String,
      location: String,
      icao: String,
      country_name: String,
      charges_per_hour: Number,
      rating: Number,
      margin: Number,
      sr_no: Number,
    },
  ],
  role: {
    type: String
  },
});
const hotelOwnerchema = new Mongoose.Schema({
  Hotel_type: {
    type: String,
    enum: ["5 Star", "4 Star", "3 Star"],
  },
  Tail_sign: {
    type: String,
  },
  location: {
    type: String,
  },
  icao: {
    type: String,
  },
  country_name: {
    type: String,
  },
  charges_per_hour: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  margin: {
    type: Number,
    default: 0,
  },

  sr_no: {
    type: Number,
  },

  date: { type: Date, default: Date.now },
  operator: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "OperatorSchema",
  },
});

const Operator = Mongoose.model("Operator", OperatorSchema);
const AircraftOPerator = Mongoose.model("AircraftOPerator", hotelOwnerchema);
module.exports = { Operator, AircraftOPerator };
