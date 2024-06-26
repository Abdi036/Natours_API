const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: ".env" });

const app = require("./app");
// creating connection to database
const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully.");
  })
  .catch((err) => {
    console.error("DB connection Error:", err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
