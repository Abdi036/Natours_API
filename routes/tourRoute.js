const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  topCheap,
  getTourStats,
  getMonthlyPlan,
} = require("./../Controllers/tourController");
const { protectMiddleware } = require("../Controllers/authController");

const router = express.Router();

// addind alies to top-5-cheapest tours
router.route("/top-5-cheap").get(topCheap, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protectMiddleware, getAllTours).post(createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
