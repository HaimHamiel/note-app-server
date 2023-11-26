const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Note = require("../models/noteModel");

// @desc Get user notes
// @route GET /api/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {
  //Get user using the id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const notes = await Note.find({ user: req.user.id });

  res.status(200).json(notes);
});

// @desc Get user note
// @route GET /api/notes/:id
// @access Private
const getNote = asyncHandler(async (req, res) => {
  //Get user using the id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  res.status(200).json(note);
});

// @desc Create new note
// @route POST /api/notes
// @access Private
const createNote = asyncHandler(async (req, res) => {
  const {description } = req.body;
  if (!description) {
    res.status(400);
    throw new Error("Please add a description");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  
  const note = await Note.create({
    description,
    user: req.user.id,
  });
  
  res.status(201).json(note);
});

// @desc Delete user note
// @route DELETE /api/notes/:id
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  //Get user using the id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  await note.remove();

  res.status(200).json({ success: true });
});

// @desc Update user note
// @route PUT /api/notes/:id
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  //Get user using the id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedNote);
});

module.exports = {
  getNote,
  getNotes,
  createNote,
  deleteNote,
  updateNote,
};
