const express = require("express");

const {
  getAllReviews,
  createReviews,
} = require("../Controllers/reviewController");
const {
  protectMiddleware,
  restrictTo,
} = require("../Controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protectMiddleware, restrictTo("user"), createReviews);

module.exports = router;
