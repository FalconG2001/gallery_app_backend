const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("unhandledRejection", (err) => {
  console.log("Unhandler rejection...Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception...Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");
const port = process.env.PORT || 7000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB connection success!");
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
