// const express = require("express");
// const {
//   getAllTours,
//   getTourById,
//   createTour,
//   updateTour,
//   deleteTour,
//   topCheap,
//   getTourStats,
//   getMonthlyPlan,
// } = require("./../Controllers/tourController");
// const {
//   protectMiddleware,
//   restrictTo,
// } = require("../Controllers/authController");

// const router = express.Router();

// // addind alies to top-5-cheapest tours
// router.route("/top-5-cheap").get(topCheap, getAllTours);

// router.route("/tour-stats").get(getTourStats);
// router.route("/monthly-plan/:year").get(getMonthlyPlan);

// router.route("/").get(protectMiddleware, getAllTours).post(createTour);
// router
//   .route("/:id")
//   .get(getTourById)
//   .patch(updateTour)
//   .delete(protectMiddleware, restrictTo("admin", "lead-guide"), deleteTour);

// module.exports = router;

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
const {
  protectMiddleware,
  restrictTo,
} = require("../Controllers/authController");

const router = express.Router();

// Adding alias to top-5-cheapest tours
router.route("/top-5-cheap").get(topCheap, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router
  .route("/")
  .get(protectMiddleware, getAllTours)
  .post(protectMiddleware, restrictTo("admin", "lead-guide"), createTour);

router
  .route("/:id")
  .get(protectMiddleware, getTourById)
  .patch(protectMiddleware, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protectMiddleware, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
