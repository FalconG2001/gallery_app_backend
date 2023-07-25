const Image = require("./../models/imageModel");
const factory = require("./handlerFactory");

exports.getAllImages = factory.getAll(Image);
exports.uploadImage = factory.createOne(Image);
exports.getImageById = factory.getOne(Image);
exports.deleteImageById = factory.deleteOne(Image);
exports.updateImageById = factory.updateOne(Image);
