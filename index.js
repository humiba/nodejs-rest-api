const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const { logging } = require("./middleware/logging");

/** Init Server (App) */
const app = express();

require("dotenv").config();

// Middleware handles logging
app.use(logging)

/** Routers List */
const userRouter = require("./routers/userRouter");

// !note: this line comes right after routers list
app.use(bodyParser.json());

/** Using Routers */
app.use(userRouter);

/** Run the Server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/** Connect to DB */
const CONNECTION_STRING = process.env.CONNECTION_STRING || 4000;
mongoose
  .connect(CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB successfully");
  })
  .catch((error) => {
    console.log(`Connect to MongoDB fail! - ${error.message}`);
  });
