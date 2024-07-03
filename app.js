const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const app = express();
// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Rate limiter middleware
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per hour)
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again after an hour",
});

// Apply the rate limiter to all requests
app.use("/api", limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
