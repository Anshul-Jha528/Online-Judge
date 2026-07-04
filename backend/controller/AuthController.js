const User = require("../model/Users");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
        let userID ="";
        let isUnique = false;
        while(!isUnique){
            userID = crypto.randomBytes(4).toString('hex');
            if(!await User.findOne({userID: userID})){
                isUnique = true;
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName: fullName,
            email: email,
            hashPassword: hashedPassword,
            userID: userID
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error while registering ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(password, existingUser.hashPassword);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({userID: existingUser.userID}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRY});
        res.status(200).json({ message: "User logged in successfully", username: existingUser.fullName, token: token, userID: existingUser.userID , isAdmin: existingUser.isAdmin});
    } catch (error) {
        console.error("Error while logging in ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUserData = async(req, res) => {
    try{
        const userID = req.params.userID;
        const user = await User.findOne({userID: userID}).select("-hashPassword -_id");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: user });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Couldn't get user data" });
    }
}

const updateUserData = async(req, res) => {
    try{
        const {userID, fullName } = req.body;
        if(!userID){
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findOne({userID: userID});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        console.log(userID, fullName);
        user.fullName = fullName;
        await user.save();
        res.status(200).json({ message: "User data updated successfully", user: user });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Couldn't get user data" });
    }
}

const changePassword = async(req, res) => {
    try{
        const {userID, oldPassword, newPassword } = req.body;
        if(!userID || !oldPassword || !newPassword){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({userID: userID});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.hashPassword);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect current password" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.hashPassword = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully", user: user });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Couldn't change password" });
    }
}

const makeUserAdmin = async (req, res) => {
    try {
        const userID = req.body.userID;
        if(!userID){
            return res.status(400).json({ message: "User ID is required" });
        }
        console.log(userID);
        const existingUser = await User.findOne({userID: userID});
        if(!existingUser){
            return res.status(400).json({ message: "User not found" });
        }
        existingUser.isAdmin = true;
        await existingUser.save();
        res.status(200).json({ message: "User made admin successfully", user: existingUser });
    } catch (error) {
        console.error("Error while making user admin ", error);
        res.status(500).json({ message: "Couldn't make admin" });
    }
}

const removeUserAdmin = async(req, res) => {
    try {
        const userID = req.params.userID;
        if(!userID){
            return res.status(400).json({ message: "User ID is required" });
        }
        console.log(userID);
        const existingUser = await User.findOne({userID: userID});
        if(!existingUser){
            return res.status(404).json({ message: "User not found" });
        }
        existingUser.isAdmin = false;
        await existingUser.save();
        res.status(200).json({ message: "User removed from admin successfully", user: existingUser });
    } catch (error) {
        console.error("Error while removing admin ", error);
        res.status(500).json({ message: "Couldn't remove from admin" });
    }
}

const deleteAccount = async(req, res) =>{
    try{
        const userID = req.params.userID;
        if(!userID){
            return res.status(400).json({ message: "User ID is required" });
        }
        if(userID!==req.user.userID){
            return res.status(403).json({ message: "You are not authorized to delete this account" });
        }
        const user = await User.findOne({userID: userID});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        await User.deleteOne({userID: userID});
        res.status(200).json({ message: "Account deleted successfully" });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Couldn't delete account" });
    }
}

module.exports = { registerUser, loginUser, getUserData, updateUserData, changePassword, makeUserAdmin, removeUserAdmin, deleteAccount };