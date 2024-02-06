const express = require("express");
const {
  register,
  login,
  activateAccount,
  updateEmail,
  updatePhone,
  getAllUsers,
  sendFriendRequest,
  resposeToRequest,
  getAllFriends
} = require("../controllers/user");
const {  upload, updateProfile, getUserProfileById } = require('../util/profilePicUpload');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/activate", activateAccount);
router.get("/getusers", getAllUsers);

// Use 'upload' middleware for handling file upload
router.post('/profile/:id', upload.single('picture'), updateProfile);
router.get('/profile/:id', getUserProfileById );
router.put('/updateEmail/:id', updateEmail);
router.put('/updatePhone/:id', updatePhone);
router.post('/sendfrindrequest', sendFriendRequest);
router.post('/responsetorequest',resposeToRequest);
router.get('/getfriends/:id', getAllFriends);

module.exports = router;
