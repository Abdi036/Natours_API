const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TourModel = require("../models/toursModel");

dotenv.config({ path: ".env" });

// creating connection to database
const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully.");
  })
  .catch((err) => {
    console.error("DB connection Error:", err);
  });

//   READ JSON FILE

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`, "utf-8")
);

// import data to DB
async function importData() {
  try {
    await TourModel.create(tours);
    console.log("Data loaded successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

//Delete All data from DB collection
async function deleteData() {
  try {
    await TourModel.deleteMany();
    console.log("Data deletd successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
