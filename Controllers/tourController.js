const TourModel = require("../models/toursModel");

exports.topCheap = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // build query
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    // Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = TourModel.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await TourModel.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }
    // excute query
    const tours = await query;
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
      message: err,
    });
  }
};

// patch(update)
exports.updateTour = async (req, res) => {
  try {
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Fail to update",
    });
  }
};

// delete
exports.deleteTour = async (req, res) => {
  try {
    await TourModel.findOneAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "File not found",
    });
  }
};
