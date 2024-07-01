const User = require("./../models/userModel");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  }); 
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
};
