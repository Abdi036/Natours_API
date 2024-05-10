const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Hello from server side!!!" });
// });

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// get request
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
});

// post request
app.post("/api/v1/tours", (req, res) => {
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
});

// get request with params

app.get("/api/v1/tours/:id", (req, res) => {
  const id = +req.params.id;
  const tour = toursData.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: "fail", message: "INVALID ID" });
  }
  res.status(200).json({ status: "success", data: { tour } });
});

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
