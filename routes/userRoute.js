const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
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

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
