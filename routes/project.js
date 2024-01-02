const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadFile, upload } = require("../util/uploadDocs");
const { getprojectbyid, createProject } = require("../controllers/project");
const { authUser } = require("../middlewares/auth");

// const upload = uploadDocs();
const multerMiddleware = multer().none(); //It will make the parsed form fields available in the req.body object.

router.post("/createProject", authUser, multerMiddleware, createProject);
// router.post("/docs", upload.array("files"), uploadDocuments);
router.get("/getprojectbyid/:id", getprojectbyid);
router.post("/upload-to-cloudinary", upload.array("files"), uploadFile);

module.exports = router;
