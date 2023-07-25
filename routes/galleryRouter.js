const express = require("express");
const multer = require("multer");
const AppError = require("../utils/appError");
const Image = require("../models/imageModel");
const User = require("../models/userModel");

const middleware = require("./../utils/middlewares");

const { protect, restrictToOwner } = require("./../controllers/authController");
const galleryController = require("./../controllers/galleryController");

const commentRoutes = require("./commentRouter");
const albumRoutes = require("./albumRouter");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const router = express.Router();

router.route("/").get(middleware.getAll, galleryController.getAllImages);
router.route("/:id").get(galleryController.getImageById);

router.use("/comments", commentRoutes);
router.use(protect);
router.use("/albums", albumRoutes);

router
  .route("/:id")
  .patch(
    upload.single("image"),
    middleware.uploadMul,
    middleware.updateModelMiddleware(Image),
    galleryController.updateImageById
  )
  .delete(restrictToOwner(Image), galleryController.deleteImageById);

router.post(
  "/:id/like",
  middleware.likeMiddleware(User, "img"),
  galleryController.updateImageById
);

router.post(
  "/upload",
  upload.single("image"),
  middleware.uploadMul,
  middleware.uploadAuthentication,
  galleryController.uploadImage
);

module.exports = router;
