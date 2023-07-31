const express = require("express");
const authController = require("./../controllers/authController");
const galleryRoutes = require("./galleryRouter");
const tagsController = require("../controllers/tagController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forget-password", authController.forgotPassword);

router.use("/gallery", galleryRoutes);
router.route("/tags").get(tagsController.getAllTags);
router.get("/tags/:search", tagsController.searchTag);

router.use(authController.protect);
router.get("/hydrate", authController.getMe);
router.post("/update-password", authController.updatePassword);
router.delete(
  "/delete-me",
  authController.deleteMiddlware,
  authController.deleteMe
);

module.exports = router;
