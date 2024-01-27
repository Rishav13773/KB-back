const express = require("express");
const {
  register,
  login,
  activateAccount,
  updateEmail,
  updatePhone,
} = require("../controllers/user");
const {  upload, updateProfile, getUserProfileById } = require('../util/profilePicUpload');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/activate", activateAccount);

// Use 'upload' middleware for handling file upload
router.post('/profile/:id', upload.single('picture'), updateProfile);
router.get('/profile/:id', getUserProfileById )
router.put('/updateEmail/:id', updateEmail)
router.put('/updatePhone/:id', updatePhone)

module.exports = router;
