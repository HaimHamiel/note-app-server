const express = require("express");
const router = express.Router();
const {
  getNote,
  getNotes,
  createNote,
  deleteNote,
  updateNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

const cors = require("cors");
// enable CORS for all routes in this router
router.use(cors());

router.route("/").get(protect, getNotes).post(protect, createNote);

router.route("/:id").get(protect, getNote).delete(protect, deleteNote).put(protect, updateNote);

module.exports = router;
