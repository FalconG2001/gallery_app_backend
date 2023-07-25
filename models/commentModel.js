const mongoose = require("mongoose");
const Image = require("./imageModel");

const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    comment: {
      type: String,
      required: [true, "A comment shoul have a message"],
    },
    likes: { type: Number, default: 0 },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
