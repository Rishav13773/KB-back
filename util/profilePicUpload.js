const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const User = require('../models/User');
const mongoose = require('mongoose'); // Add this line for ObjectId validation

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
    params:(req, file)=> { 
        const userName = req.body.firstName; // need to change to the userName for test using the first name of user
        const subfolder = 'Profile_Pics'

        console.log("in stroage function, file: ", file)
       return  {
        folder: `${userName}/${subfolder}`,
        resource_type: "auto",
        public_id: 'profile_pics',

    };
},
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 50, // 50 MB limit (adjust as needed)
    },
});

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const {  username, firstName, lastName, bio } = req.body;
        const picture = req.file;
        
        // console.log("userId: ", userId);
        console.log("picture: ", picture);

        console.log(req.body);  // Log the form data
        console.log(req.file);  // Log the uploaded file

        const user = await User.findById(userId);

        console.log("user: ", user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (picture) {
            const result = await cloudinary.uploader.upload(picture.path);
            user.picture = result.secure_url;
        }
        console.log("user.picture: ", user.picture)

        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.details.bio = bio;

        await user.save();

        res.json({ message: 'Profile updated successfully', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("in get api user.id: ",userId)

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { updateProfile, upload, getUserProfileById };
