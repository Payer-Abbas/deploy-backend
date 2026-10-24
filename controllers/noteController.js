const Note = require("../models/Note");

// GET /api/notes — Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ pinned: -1, createdAt: -1 });
    res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/notes/:id — Get single note
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notes — Create a note
const createNote = async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body;
    const note = await Note.create({ title, content, color, pinned });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/notes/:id — Update a note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/notes/:id — Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
