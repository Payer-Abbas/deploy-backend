const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePin,
  toggleArchive,
  deleteNote,
} = require("../controllers/noteController");

router.route("/").get(getAllNotes).post(createNote);
router.patch("/:id/pin", togglePin);
router.patch("/:id/archive", toggleArchive);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

module.exports = router;
