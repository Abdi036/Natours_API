const fs = require("fs");
const express = require("express");

const app = express();

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Hello from server side!!!" });
// });

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
});

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
