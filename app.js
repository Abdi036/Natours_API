const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const app = express();
// MIDDLEWARES
app.use(helmet());
app.use(morgan("dev"));

// Body parser Reading data from body to req,body
app.use(express.json({ limit: "10kb" }));
// Serving static Files
app.use(express.static(`${__dirname}/public`));
// Data sanitization against xss
app.use(xss());
// Data sanitization against NOSQL query injection
app.use(mongoSanitize());
// prevent parameter polution
app.use(hpp());
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
