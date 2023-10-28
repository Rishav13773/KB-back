const express = require("express");
const {
  register,
  login,
  activateAccount,
  profileUpdate,
} = require("../controllers/user");
const router = express.Router();
const { profilePicUpload } = require("../util/profilePicUpload");

const picUpload = profilePicUpload();

router.post("/register", register);
router.post("/login", login);
router.post("/activate", activateAccount);
router.post("/profile", picUpload.single("picture"), profileUpdate);

module.exports = router;
