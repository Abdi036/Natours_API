const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("./../Controllers/tourController");

const router = express.Router();

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;