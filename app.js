const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from server side!!!" });
});

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
