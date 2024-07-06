const Review = require("../models/reviewModel");

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      status: "success",
      result: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.createReviews = async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
