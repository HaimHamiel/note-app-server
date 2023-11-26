const express = require("express");
const routers = express.Router();
const user = require("./userRoutes");
const notes = require("./notesRoutes");

routers.use("/api/users", user);

routers.use("/api/notes", notes);

module.exports = routers;
