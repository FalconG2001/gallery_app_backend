const express = require("express");
const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");

const app = express();

app.enable("trust proxy");
app.use(cors());

//HTTP Headers
app.use(helmet());
/**MIDDLEWARES */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, Please try again in an hour!",
// });
// app.use("/", limiter);

//Body parser, reading data from req.body
app.use(express.json({ limit: "10mb" }));

//Data Sanitization against NoSql Query Injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameters pollution
app.use(hpp({}));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Requested page not found on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
