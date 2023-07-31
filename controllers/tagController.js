const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllTags = factory.getAll(Tag);
exports.searchTag = catchAsync(async (req, res, next) => {
  let tags;

  tags = await Tag.find({ name: new RegExp(req.params.search, "i") });

  res.status(200).json({
    status: "success",
    tags,
  });
});
