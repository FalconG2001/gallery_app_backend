const Comment = require("./../models/commentModel");
const User = require("../models/userModel");
const Image = require("../models/imageModel");
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({});

const middleware = require("./../utils/middlewares");

const commentController = require("./../controllers/commentController");
const { protect, restrictToOwner } = require("./../controllers/authController");

router.route("/:imgId").get(commentController.getAllComments);

router.use(protect);

router.route("/:imgId").post(upload.any(), commentController.createComment);

router.delete(
  "/:imgId/:id",
  restrictToOwner(Comment),
  commentController.deleteCommentMiddleware,
  commentController.deleteComment
);

router.post(
  "/:imgId/:id/like",
  middleware.likeMiddleware(User, "cmt"),
  commentController.updateComment
);

module.exports = router;
