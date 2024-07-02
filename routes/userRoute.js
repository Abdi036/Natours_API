// const express = require("express");
// const {
//   signup,
//   login,
//   forgotPassword,
//   resetPassword,
//   protectMiddleware,
//   updatePassword,
// } = require("./../Controllers/authController");
// const {
//   getAllUsers,
//   createUser,
//   getUser,
//   updateUser,
//   deleteUser,
// } = require("./../Controllers/userController");

// const router = express.Router();

// router.route("/signup").post(signup);
// router.route("/login").post(login);

// router.route("/forgotPassword").post(forgotPassword);
// router.route("/resetPassword/:token").patch(resetPassword);
// router.route("/updateMypassword").patch(protectMiddleware, updatePassword);

// router.route("/").get(getAllUsers).post(createUser);
// router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

// module.exports = router;

const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protectMiddleware,
  updatePassword,
} = require("./../Controllers/authController");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("./../Controllers/userController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMyPassword").patch(protectMiddleware, updatePassword);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
