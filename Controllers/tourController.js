const TourModel = require("../models/toursModel");

exports.getAllTours = async (req, res) => {
  try {
    const tours = await TourModel.find();
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: "Not Found",
    });
  }
};

// get request with params/ID
exports.getTourById = async (req, res) => {
  try {
    const tour = await TourModel.findById(req.params.id);
    res.status(200).json({ status: "success", data: tour });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Not Found",
    });
  }
};

// post(create)
exports.createTour = async (req, res) => {
  try {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      stattus: "fail",
      message: "Invalid Data",
    });
  }
};

// patch(update)
exports.updateTour = (req, res) => {
  if (+req.params.id > toursData.length) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated yeeey>",
    },
  });
};

// delete
exports.deleteTour = (req, res) => {
  if (+req.params.id > toursData.length) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
