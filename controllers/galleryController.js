const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Image = require("./../models/imageModel");
const factory = require("./handlerFactory");

exports.getAllImages = factory.getAll(Image);
exports.uploadImage = factory.createOne(Image);
exports.getImageById = factory.getOne(Image);
exports.deleteImageById = factory.deleteOne(Image);
exports.updateImageById = factory.updateOne(Image);

exports.searchImages = catchAsync(async (req, res, next) => {
  const search = req.params.name;
  const data = await Image.find({ title: new RegExp(search, "i") });

  res.status(200).json({
    status: "success",
    search: data,
  });
});

exports.getLikedImages = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const likedImagesId = user.imageLikes;

  const likedImages = await Image.find({ _id: { $in: likedImagesId } });

  res.status(200).json({
    status: "success",
    favourites: likedImages,
  });
});
