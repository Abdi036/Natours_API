const TourModel = require("../models/toursModel");

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

// get request with params/ID
exports.getTourById = (req, res) => {
  const id = +req.params.id;
  const tour = toursData.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(200).json({ status: "success", data: { tour } });
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
