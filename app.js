const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const app = express();
// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
