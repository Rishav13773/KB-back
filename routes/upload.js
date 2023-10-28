const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadDocs } = require("../util/uploadDocs");
const { uploadDocuments, createProject } = require("../controllers/upload");
const { authUser } = require("../middlewares/auth");

const upload = uploadDocs();
const multerMiddleware = multer().none(); //It will make the parsed form fields available in the req.body object.

router.post("/createProject", authUser, multerMiddleware, createProject);
router.post("/docs", upload.array("files"), uploadDocuments);

module.exports = router;
