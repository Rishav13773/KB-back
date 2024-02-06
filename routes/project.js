const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadFile, upload, setUserInRequest } = require("../util/uploadDocs");
const {
  getprojectbyid,
  createProject,
  getdocumentByPid,
  trashProject,
  restoreProject,
  deletProject,
  starredProject,
} = require("../controllers/project");
const { authUser } = require("../middlewares/auth");

// const upload = uploadDocs();
const multerMiddleware = multer().none(); //It will make the parsed form fields available in the req.body object.

router.post("/createProject", authUser, multerMiddleware, createProject);
// router.post("/docs", upload.array("files"), uploadDocuments);
router.get("/getprojectbyid/:id", getprojectbyid);
router.post("/upload-to-cloudinary/:id", upload.array("files"), uploadFile);
router.get("/getdocumentByPid/:id", getdocumentByPid);
router.put("/trashProject/:id", trashProject);
router.put("/restoreProject/:id", restoreProject);
router.delete("/deletProject/:id", deletProject);
router.put("/starredProject/:id", starredProject);

module.exports = router;
