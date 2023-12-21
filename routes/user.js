const express = require("express");
const {
  register,
  login,
  activateAccount,
} = require("../controllers/user");
const {  upload, updateProfile } = require('../util/profilePicUpload');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/activate", activateAccount);

// Use 'upload' middleware for handling file upload
router.post('/profile', upload.single('picture'), updateProfile);

module.exports = router;
