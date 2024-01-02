// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const { v4: uuidv4 } = require('uuid');
// const multer = require("multer");
// const mongoose = require("mongoose");
// const fs = require("fs");

// const Docs = require("../models/Document");
 
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_APIR_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params:(req, file)=> { 
//       const userName = req.body.firstName; // need to change to the userName for test using the first name of user

//       let folder; 
  
//       //checking the type of file being uploaded to create folder of that type.
//       if( file.mimetype.startsWith('image/')){
//         folder = 'Images';
//       } else if (file.mimetype.startsWith('video/')){
//         folder = 'Videos';
//       } else if (file.mimetype.startsWith('application/pdf') || file.mimetype.startsWith('application/msword')){
//         folder = 'Documents';
//       } else {
//         folder = 'Miscellaneous';
//       }
//       return  {
//       folder: `${userName}/${folder}`,
//       resource_type: "auto",
//       public_id: 'docs',

//   };
// },
// });

// const upload = multer({
//   storage: storage,
//   // fileFilter: fileFilter,
// });

// const uploadFile = async ( req, res ) => {
//   try{
//     const { projectId} = req.params;

//     const file = req.file;

//     const docs = await Docs.findById(projectId);

//     if(!Docs){
//       return res.status(404).json({ message : 'User not found' });
//     }

//     if(file){
//       const result = await cloudinary.uploader.upload(file.path);
//       Docs.file= result.secure_url;
//     }

//     await Docs.save();

//     res.json({message: 'Document uploaded Successfully', Docs: Docs});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
// }
// }

// module.exports = {uploadFile, upload }

const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const Docs = require("../models/Document"); // Import your Docs model

// No need to create a new Express app instance here

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const userName = req.body.firstName;

    let folder;

    if (file.mimetype.startsWith("image/")) {
      folder = "Images";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "Videos";
    } else if (
      file.mimetype.startsWith("application/pdf") ||
      file.mimetype.startsWith("application/msword")
    ) {
      folder = "Documents";
    } else {
      folder = "Miscellaneous";
    }

    return {
      folder: `${userName}/${folder}`,
      resource_type: "auto",
      public_id: "docs",
    };
  },
});

// Multer upload middleware
const upload = multer({
  storage: storage,
});

const uploadFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const file = req.file;

    // Log the projectId and file details for debugging
    console.log("projectId:", projectId);
    console.log("file:", file);

    // Ensure that the file upload to Cloudinary is successful before accessing secure_url
    const result = await cloudinary.uploader.upload(file.path);

    // Create a new Docs document with the Cloudinary URL
    const docs = new Docs({
      url: result.secure_url,
      projectId: projectId,
    });

    // Save the document to the database
    await docs.save();

    res.json({
      message: "Document uploaded successfully",
      document: docs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { uploadFile, upload };
