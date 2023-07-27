const mongoose = require("mongoose");
const User = require("./userModel");
const Tag = require("./tagModel");
const Comment = require("./commentModel");
const Album = require("./albumModel");

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
    tags: {
      type: [String],
      required: [true, "A Image should have atleat one tag"],
    },
    date: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A image should belong to a user!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

imageSchema.post("save", async (doc, next) => {
  const id = doc._id;
  await User.findByIdAndUpdate(doc.uploadedBy, { $push: { images: id } });

  for (let tag of doc.tags) {
    await Tag.findOneAndUpdate(
      { name: tag },
      { $push: { images: id } },
      { upsert: true }
    );
  }

  next();
});

imageSchema.post("findOneAndDelete", async (doc, next) => {
  await User.updateMany(
    { images: doc._id },
    { $pull: { images: doc._id, imageLikes: doc._id } }
  );
  await Tag.updateMany({ images: doc._id }, { $pull: { images: doc._id } });

  if (doc.comments.length > 0) {
    await Comment.deleteMany({ _id: { $in: doc.comments } });
  }
  await Album.findOneAndUpdate(
    { uploadedBy: doc.uploadedBy },
    { $pull: { images: doc._id } }
  );

  next();
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
