const mongoose = require("mongoose");

// schema for database
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});
// creating a model
const TourModel = mongoose.model("Tour", tourSchema);
 

module.exports = TourModel;