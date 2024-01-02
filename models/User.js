const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const projectSchema = require("./Project");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      text: true,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      text: true,
    },
    userName: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    details: {
      bio: {
        type: String,
        trim: true,
        default: "No bio",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
