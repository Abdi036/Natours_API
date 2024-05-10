const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const app = express();
// MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
// App response
const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
