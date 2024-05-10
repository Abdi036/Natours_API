const fs = require("fs");
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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
exports.createTour = (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
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
