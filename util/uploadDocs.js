const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const Document = require("../models/Document"); // Add this line

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // console.log("params in stroage",params)
    console.log("in storage function: ", file)
    const userName = req.body.userName;
    let folder;

    if (file.mimetype.startsWith("image/")) {
      folder = "Images";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "Videos";
    } else if (file.mimetype.startsWith("application/pdf")) {
      folder = "Documents";
    } else {
      folder = "Miscellaneous";
    }
    console.log("return : ",`${userName}/${folder}`," ", file.mimetype.startsWith("video/") ? "video" : "auto", " ", file.originalname.replace(/\.[^/.]+$/, ""));

    return {
      folder: `${userName}/${folder}`,
      resource_type: file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/") ? file.mimetype.split("/")[0] : "raw",
      public_id: file.originalname.replace(/\.[^/.]+$/, ""),    };
  },
});

const upload = multer({
  storage: storage,
});


const uploadFile = async (req, res) => {
  try {
    console.log("in upload function, before getting files ");

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    console.log("after getting files")

    const projectId = req.params.id;
    const files = req.files;
console.log("projectId: ", projectId)
    // console.log("in uploadfile func files:", files);

    console.log("before uploading files")
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          console.log("Processing file:", file.originalname);
          console.log("File properties:", file);
    
          let result;
    
          if (file.mimetype.startsWith("image/")) {
            result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
          } else if (file.mimetype.startsWith("video/")) {
            result = await cloudinary.uploader.upload(file.path, { resource_type: "video" });
          } else {
            result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
          }
    
          console.log("Upload result:", result);
          return result;
        } catch (error) {
          console.error(`Error uploading ${file.originalname}:`, error.message);
          throw error;
        }
      })
    );

    console.log("after the uploading files")
    

    // console.log("results: ", results);

    const urls = results.map((result) => result.secure_url);

    console.log("urls: ", urls)

    const document = new Document({
      urls,
      project: projectId,
    });

    console.log("before saving the docs")
    
    await document.save();
    console.log("AFTER saving the docs")

    res.json({
      message: "Document uploaded successfully",
      document: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { uploadFile, upload };
