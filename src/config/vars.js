const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  dbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
};

