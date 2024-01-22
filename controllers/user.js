const { validateEmail, validateLength } = require("../helpers/validation");
const User = require("../models/User");
const { generateUsername } = require("unique-username-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");

// takes care of form validation and registration to DB
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email" });
    }
    const check = await User.findOne({ email });
    if (check) {
      res.status(400).json({ message: "email address already exists" });
    }

    // if (!validateLength(firstName, 3, 30)) {
    //   return res.status(400).json({
    //     message: "first name must between 3 and 30 characters.",
    //   });
    // }
    // if (!validateLength(lastName, 3, 30)) {
    //   return res.status(400).json({
    //     message: "last name must between 3 and 30 characters.",
    //   });
    // }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "password must be atleast 6 characters.",
      });
    }

    // const newUsername = generateUsername("-", 2, 20);
    const cryptedPassword = await bcrypt.hash(password, 12);

    //saving user credentials to database
    const user = await new User({
      email,
      username: username,
      password: cryptedPassword,
    }).save();

    //email verification
    const emailVerification = generateToken({ id: user._id.toString() }, "40m");
    // const url = `${process.env.BASE_URL}/activate/${emailVerification}`;
    // sendVerificationEmail(user.email, user.firstName, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    console.log("token :", token);

    return res.send({
      id: user._id,
      picture: user.picture,
      username: user.username,
      token: token,
      details: user.details,
      verified: user.verified,
      message: "Register Success, please activate your account",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const token = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (validUser != user.id) {
      return res.status(400).json({
        message: "You don't have the authorization to complete this operation",
      });
    }

    if (check.verified == true) {
      return res.send(400).json({ message: "This email is already verified" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has beeen activated successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//check and validate login credentials
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:
          "the email address you entered is not connected to an account.",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials.Please try again.",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      details: user.details,
      token: token,
      verified: user.verified,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmail = async (req, res) => {
  try{
    const userId = req.body.id;
    const userEmail = req.body.email;
    
    const user = await User.findByIdAndUpdate(userId, {email : userEmail});

    res.json({message : 'User Email Updated Successfully', user : user});

  }catch(error){
    console.log("error: ", error)
  }
}

exports.updatePhone = async (req, res) =>{
  try{
    const userId = res.body.id;
    const userPhone = res.body.phone;

    const user = await User.findByIdAndUpdate(userId, {phoneNo : userPhone});

    res.json({message : 'User Phone NUmber Updated Successfully', user : user});

  }catch(error){
    console.log("Error Occurred: ", error)
  }
}