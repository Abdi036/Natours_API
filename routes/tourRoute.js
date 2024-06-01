const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  topCheap,
} = require("./../Controllers/tourController");

const router = express.Router();

// addind alies to top-5-cheapest tours
router.route("/top-5-cheap").get(topCheap, getAllTours);
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
