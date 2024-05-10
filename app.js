const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// functions

// get request
function getAllTours(req, res) {
  res.status(200).json({
    status: "success",
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
}

// get request with params/ID
function getTourById(req, res) {
  const id = +req.params.id;
  const tour = toursData.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(200).json({ status: "success", data: { tour } });
}

// post(create)
function createTour(req, res) {
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
}

// patch(update)
function updateTour(req, res) {
  if (+req.params.id > toursData.length) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated yeeey>",
    },
  });
}

// delete
function deleteTour(req, res) {
  if (+req.params.id > toursData.length) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
}

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id", getTourById);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// refactored form of the above routes
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

// App response
const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
