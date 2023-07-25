const Comment = require("./../models/commentModel");
const Image = require("./../models/imageModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createComment = catchAsync(async (req, res, next) => {
  req.body.username = req.user.name;
  req.body.uploadedBy = req.user._id;
  const newComment = await Comment.create(req.body);
  await Image.findOneAndUpdate(
    { _id: req.params.imgId },
    { $push: { comments: newComment._id } }
  );

  res.status(201).json({
    status: "success",
    comment: newComment,
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const imageComments = await Image.find({ _id: req.params.imgId }).select({
    comments: 1,
    _id: 0,
  });

  const comments = await Comment.find({
    _id: { $in: imageComments[0].comments },
  });

  res.status(200).json({
    status: "success",
    comments,
  });
});
exports.updateComment = factory.updateOne(Comment);

exports.deleteCommentMiddleware = catchAsync(async (req, res, next) => {
  const id = req.params.imgId;
  const cmtId = req.params.id;
  await Image.findOneAndUpdate({ _id: id }, { $pull: { comments: cmtId } });
  next();
});
exports.deleteComment = factory.deleteOne(Comment);
