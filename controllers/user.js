const { validateEmail, validateLength } = require("../helpers/validation");
const User = require("../models/User");
const { generateUsername } = require("unique-username-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");
const { response } = require("express");
const { request } = require("http");

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
    // const emailVerification = generateToken({ id: user._id.toString() }, "40m");
    // const url = `${process.env.BASE_URL}/activate/${emailVerification}`;
    // sendVerificationEmail(user.email, user.firstName, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    console.log("token :", token);

    return res.send({
      id: user._id,
      email: user.email,
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
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      details: user.details,
      token: token,
      verified: user.verified,
      phoneNo:user.phoneNo,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) =>{
  try{
    const users =await User.find({});
    
    if(!users){
      return res.status(400).json({message: "No User Found"})
    }

    res.json({users:users, message:"Users found"})
  }catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.updateEmail = async (req, res) => {
  try {
    console.log("in update Email");

    const userId = req.params.id;
    const userEmail = req.body.email;
    console.log("email: ", req.body.email);
    console.log("userEmail: ", userEmail);

    const user = await User.findByIdAndUpdate(userId, { email: userEmail });

    res.json({ message: "User Email Updated Successfully", user: user });
  } catch (error) {
    console.log("error: ", error);
  }
};

exports.updatePhone = async (req, res) => {
  try {
    console.log("in update Phone");
    const userId = req.params.id;
    const userPhone = req.body.phone;
    console.log("phone : ", req.body.phone);

    const user = await User.findByIdAndUpdate(userId, { phoneNo: userPhone });

    res.json({ message: "User Phone NUmber Updated Successfully", user: user });
  } catch (error) {
    console.log("Error Occurred: ", error);
  }
};


exports.sendFriendRequest = async (req, res) => {
  try {

    const { senderId, recipientId } = req.body;

    // Senders 
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(400).json({ error: "Sender user not found in records" });
    }

    if (sender.friendRequests.some(request => request.sender.equals(recipientId))) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Recipients
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(400).json({ error: "Recipient user not found in records" });
    }

    
    if (recipient.friendRequests.some(request => request.sender.equals(senderId))) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    sender.friendRequests.push({ sender: recipientId, status: 'pending' });
    
    recipient.friendRequests.push({ sender: senderId, status: 'pending' });

    await sender.save();
    await recipient.save();

    res.json({ success: true, message: 'Friend Request sent Successfully' });
  } catch (error) {
    console.log("Error Message: ", error.message, "Error :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resposeToRequest = async (req, res) => {
  try{

    const { responderId, senderId, accept} = req.body;
    
    
    // console.log("responder id: ", responderId);
    // console.log("sender id: ", senderId);
    // console.log("accept id: ", accept);
    
    // RESPONDER POV
    // Finding the Responder User 
    // console.log("Working on the responder DB")
    const responder = await User.findById(responderId);

    if(!responder){
      return res.status(400).json({error : 'Responder not found in record'})
    }

    // Finding the sender in the friend request array
    const senderInFriendReq = responder.friendRequests.find(request =>{
    return request.sender.equals(senderId)});
      
    if(!senderInFriendReq){
      return res.status(400).json({error: 'Sender not found in friend request'})
    }

     // Update the status based on the response
     senderInFriendReq.status = accept ? 'accepted' : 'rejected';

     if (accept) {
       // Add the friend to the responder user's friends array
       responder.friends.push(senderInFriendReq.sender);
       // Remove the friend request from the responder friend request array
       responder.friendRequests.pop({ sender: senderId});
     }

     // Save changes to the user's document
     await responder.save()


    //  SENDER POV
    // Finding sender 

    // console.log("Working on the sender DB")
    const senderUser = await User.findById(senderId);

    if(!senderUser){
      // console.log('Sender not found in record')
      return res.status(400).json({error : 'Sender not found in record'})
    }

    // finding responder in the sender frined requst array
    const responderInFriendReq = senderUser.friendRequests.find(request=>{
      console.log("responder in sender fr: ", request.sender.equals(responderId));
      return request.sender.equals(responderId);
    })

    if(!responderInFriendReq){
      // console.log('Responder Not found in the FR ');
      res.status(400).json({error: 'Responder Not found in the FR '});
    }

    // Updating status in the sender Friend request array
    responderInFriendReq.status = accept ? 'accepted' : 'rejected';

    if(accept){
      // Add the friend to the sender user's friends array
      senderUser.friends.push(responderInFriendReq.sender);
      // Remove the friend request from the sender user's friend request array
      senderUser.friendRequests.pop({sender :responderId});
    }

    await senderUser.save();


     res.json({ success: true, message: 'Friend request response processed successfully' });

  }catch(error){
    console.log("Error Message: ", error.message, "Error :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}