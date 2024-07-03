const User = require("./../models/userModel");

// function to filter unwanted role
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

// user update profile
exports.updateMyprofile = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        res.status(400).json({
          status: "fail",
          message:
            "This route is not for updating password please use(/updateMypassword)",
        })
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    logger.error(`Error during token updateProfile: ${err.message}`, {
      error: err,
    });
  }
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    data: {
      message: "this route is not defined",
    },
  });
};

// Delete Profile(Account)
exports.deleteMyProfile = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    return next(
      res.status(204).json({
        status: "success",
        data: null,
      })
    );
  } catch (error) {
    logger.error(`Error during token updateProfile: ${err.message}`, {
      error: err,
    });
  }
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
