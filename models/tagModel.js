const mongoose = require("mongoose");

const tagModel = new mongoose.Schema({
  name: String,
  images: { type: mongoose.Schema.ObjectId, ref: "Image" },
});

const Tag = mongoose.model("Tag", tagModel);

module.exports = Tag;
