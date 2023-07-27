const Album = require("../models/albumModel");
const Image = require("../models/imageModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllAlbum = catchAsync(async (req, res, next) => {
  const allAlbums = await Album.find({ uploadedBy: req.user._id });
  res.status(200).json({
    status: "success",
    albums: allAlbums,
  });
});
exports.createAlbum = catchAsync(async (req, res, next) => {
  req.body.uploadedBy = req.user._id;
  if (req.body.images !== undefined) {
    req.body.images = req.body.images.split(",");
  }
  const newAlbum = await Album.create(req.body);
  await User.findByIdAndUpdate(req.user._id, {
    $push: { albums: newAlbum._id },
  });

  res.status(201).json({
    status: "success",
    album: newAlbum,
  });
});

exports.addImages = catchAsync(async (req, res, next) => {
  req.body.images = req.body.images.split(",");
  const newAlbum = await Album.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { images: [...req.body.images] } },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    status: "success",
    message: "images added successfully",
    album: newAlbum,
  });
});

exports.removeImages = catchAsync(async (req, res, next) => {
  req.body.images = req.body.images.split(",");
  const newAlbum = await Album.findOneAndUpdate(
    { _id: req.params.id },
    { $pullAll: { images: [...req.body.images] } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "images removed successfully",
    album: newAlbum,
  });
});

exports.getImagesInAlbum = catchAsync(async (req, res, next) => {
  const albumId = req.params.id;
  const album = await Album.findById(albumId);

  const imagesId = album.images;
  const images = await Image.find({ _id: { $in: imagesId } });

  res.status(200).json({
    status: "success",
    albumImgs: images,
  });
});

exports.getAlbumById = factory.getOne(Album);
exports.updateAlbum = factory.updateOne(Album);
exports.deleteAlbum = factory.deleteOne(Album);
