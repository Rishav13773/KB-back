// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const app = express();
// app.use('/temp', express.static(path.join(__dirname, 'temp')));

// exports.profilePicUpload = () =>{
    
//     const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './temp');
//     },
//     filename: (req, file, cb) => {
//         cb(
//         null,
//         new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
//         );
//     },
//     });

//     const filefilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
//     };

//     const upload = multer({ storage: storage, filefilter: filefilter });
//     return upload;
// }

const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
app.use('/temp', express.static(path.join(__dirname, 'temp')));

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Import your User model
const User = require('../models/User'); // Update this line with the actual path to your User model

exports.profilePicUpload = () => {
  cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });

    // Correct the property name to 'fileFilter'
    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    // Add 'limits' to handle file size limit
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "Profile_pics",
            resource_type: "auto",
        },
    });

    // Update 'filefilter' to 'fileFilter'
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter, // Corrected property name
        limits: {
            fileSize: 1024 * 1024 * 50, // 5 MB limit (adjust as needed)
        },
    });

    return upload;
}

// Middleware for handling the profile update
// app.post('/profile', profilePicUpload().single('picture'),

exports.profileUpdate= async (req, res) => {
    try {
        const { firstName, lastName, bio } = req.body;
        const picture = req.file;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(picture.path);

        // Save the profile details to your local MongoDB
        const user = new User({
            firstName,
            lastName,
            bio,
            picture: result.secure_url,
        });

        await user.save();

        // Send a response
        res.json({ message: 'Profile updated successfully', pictureUrl: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = app;
