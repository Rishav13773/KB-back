const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
app.use('/temp', express.static(path.join(__dirname, 'temp')));

exports.profilePicUpload = () =>{
    
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './temp');
    },
    filename: (req, file, cb) => {
        cb(
        null,
        new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
        );
    },
    });

    const filefilter = (req, file, cb) => {
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

    const upload = multer({ storage: storage, filefilter: filefilter });
    return upload;
}