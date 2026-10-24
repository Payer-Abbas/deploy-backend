const Note = require("../models/Note");

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return undefined;
  return [
    ...new Set(
      tags
        .map((t) => String(t).trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8)
    ),
  ];
};

// GET /api/notes — Get all notes (optional ?archived=true|false)
const getAllNotes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.archived === "true") filter.archived = true;
    if (req.query.archived === "false") filter.archived = false;
    if (req.query.tag) filter.tags = String(req.query.tag).toLowerCase();

    const notes = await Note.find(filter).sort({
      pinned: -1,
      updatedAt: -1,
    });
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
    const { title, content, color, pinned, archived, tags } = req.body;
    const note = await Note.create({
      title,
      content,
      color,
      pinned,
      archived,
      tags: normalizeTags(tags) || [],
    });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/notes/:id — Update a note
const updateNote = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.tags !== undefined) {
      payload.tags = normalizeTags(payload.tags) || [];
    }

    const note = await Note.findByIdAndUpdate(req.params.id, payload, {
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

// PATCH /api/notes/:id/pin — Toggle pinned
const togglePin = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    note.pinned = !note.pinned;
    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/notes/:id/archive — Toggle archived
const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    note.archived = !note.archived;
    if (note.archived) note.pinned = false;
    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePin,
  toggleArchive,
  deleteNote,
};
