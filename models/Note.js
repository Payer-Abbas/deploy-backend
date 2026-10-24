const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    color: {
      type: String,
      default: "#0f766e",
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.length <= 8;
        },
        message: "A note can have at most 8 tags",
      },
    },
  },
  { timestamps: true }
);

// Normalize tags before save
noteSchema.pre("validate", function normalizeTags(next) {
  if (Array.isArray(this.tags)) {
    this.tags = [
      ...new Set(
        this.tags
          .map((t) => String(t).trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 8)
      ),
    ];
  }
  next();
});

module.exports = mongoose.model("Note", noteSchema);
