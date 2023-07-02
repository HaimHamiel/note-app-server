const express = require("express");
colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const { port } = require("./config/default");

//Connect to database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Basic Application" });
});

//Routes
const router = require("./routes");
app.use(router);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
