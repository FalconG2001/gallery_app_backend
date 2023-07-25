const mongoose = require("mongoose");
const User = require("./userModel");

const albumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    images: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Image",
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "An album must have a creator"],
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

albumSchema.post("findOneAndDelete", async (doc, next) => {
  const id = doc._id;
  await User.findOneAndUpdate({ albums: id }, { $pull: { albums: id } });
  next();
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
