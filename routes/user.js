const express = require("express");
const {
  register,
  login,
  activateAccount,
  // profileUpdate,
} = require("../controllers/user");
const { updateProfile, upload } = require('../util/profilePicUpload');
const router = express.Router();
// const { profilePicUpload, request } = require("../util/profilePicUpload");

// const picUpload = profilePicUpload();

router.post("/register", register);
router.post("/login", login);
router.post("/activate", activateAccount);
router.post("/profile",  upload.single('picture'), updateProfile);

module.exports = router;
