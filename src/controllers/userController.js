const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/vars");
const {
  findUser,
  addUser,
} = require("../services/userService");

// @desc Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please include all fields" });
    }

    //Find if uesr already exists
    const userExists = await findUser(email, "email");
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await addUser(name, email, hashedPassword, "No status");

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "Invalid user data." });
    }
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});


// @desc Login a new user
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Failed to get email or password from user");
    }
    const user = await findUser(email, "email");

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "Invalid user data." });
    }
    // Check user and passwords match
    if (await bcrypt.compare(password, user.password)) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

// @desc Get current user
// @route /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  try {
    if (!req?.user) {
      throw new Error("Failed to get user data");
    }
    const user = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    };

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "Invalid user data." });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

//Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
