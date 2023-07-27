const express = require("express");
const albumController = require("../controllers/albumController");
const router = express.Router();
const multer = require("multer");
const { restrictToOwner } = require("../controllers/authController");
const Album = require("../models/albumModel");
const upload = multer({});

router.use(upload.any());
router.get("/all", albumController.getAllAlbum);
router
  .route("/")
  .post(albumController.createAlbum)
  .patch(restrictToOwner(Album), albumController.updateAlbum);

router
  .route("/:id")
  .get(albumController.getImagesInAlbum)
  .delete(restrictToOwner(Album), albumController.deleteAlbum);

router
  .route("/:id/images")
  .post(restrictToOwner(Album), albumController.addImages)
  .delete(restrictToOwner(Album), albumController.removeImages);

module.exports = router;
