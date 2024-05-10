const express = require("express");

function getAllUsers(req, res) {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
}
function createUser(req, res) {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
}

function getUser(req, res) {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
}

function updateUser(req, res) {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
}

function deleteUser(req, res) {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
}

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
