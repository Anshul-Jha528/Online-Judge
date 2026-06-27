const User = require("../model/Users");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
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
        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, existingUser.hashPassword);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({userID: existingUser.userID}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRY});
        res.status(200).json({ message: "User logged in successfully", user: existingUser, token: token });
    } catch (error) {
        console.error("Error while logging in ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { registerUser, loginUser };