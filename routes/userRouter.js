const express = require("express");
const authController = require("./../controllers/authController");
const galleryRoutes = require("./galleryRouter");
const User = require("../models/userModel");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forget-password", authController.forgotPassword);

router.use("/gallery", galleryRoutes);

router.use(authController.protect);
router.get("/hydrate", authController.getMe);
router.post("/update-password", authController.updatePassword);
router.delete(
  "/delete-me",
  authController.deleteMiddlware,
  authController.deleteMe
);

module.exports = router;
