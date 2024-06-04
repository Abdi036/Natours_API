const mongoose = require("mongoose");

// schema for database
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A tour must have less or equal than 40 character"],
    minlength: [10, "A tour must have more or equal than 10 character"],
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },

  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },

  difficulty: {
    type: String,
    trim: true,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either:easy,medium,difficult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "rating must be above 1.0 "],
    max: [5, "rating must be below 5.0 "],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have an Image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  secreteTour: {
    type: Boolean,
    default: false,
  },
});

// Query middleWare
tourSchema.pre(/^find/, function (next) {
  this.find({ secreteTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// creating a model
const TourModel = mongoose.model("Tour", tourSchema);

module.exports = TourModel;
