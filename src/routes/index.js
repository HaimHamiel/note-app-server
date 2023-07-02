const express = require("express");
const routers = express.Router();
const user = require("./userRoutes");

routers.use("/api/users", user);

module.exports = routers;
