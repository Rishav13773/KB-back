const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const User = require('../models/User'); // Update the path based on your actual User model location

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Profile_Picture",
        resource_type: "auto",
    },
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB limit (adjust as needed)
    },
});

// const updateProfile = async (req, res) => {
//     try {
//         const { firstName, lastName, bio } = req.body;
//         const picture = req.file;

//         // Upload image to Cloudinary
//         const result = await cloudinary.uploader.upload(picture.path);

//         // Save the profile details to your local MongoDB
//         const user = new User({
//             firstName,
//             lastName,
//             bio,
//             picture: result.secure_url,
//         });

//         await user.save();

//         // Send a response
//         res.json({ message: 'Profile updated successfully', pictureUrl: result.secure_url });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// Import necessary modules and configurations

const updateProfile = async (req, res) => {
    try {
        const {userId,firstName, lastName, bio } = req.body;
        const picture = req.file;

        // const userId = req.params.id;
        console.log("userId : ",userId);
        console.log("userId : ",picture);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (picture) {
            const result = await cloudinary.uploader.upload(picture.path);
            console.log("img link : ", result.secure_url)
            user.picture = result.secure_url;
            console.log("user.picture : ", user.picture)
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.bio = bio;

        await user.save();

        // Return the updated profile picture URL
        res.json({ message: 'Profile updated successfully', pictureUrl: user.picture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Other middleware and route setup

module.exports = { updateProfile, upload };


module.exports = { updateProfile, upload };

