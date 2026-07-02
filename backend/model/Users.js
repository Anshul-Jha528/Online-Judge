const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    hashPassword: {
        type: String,
        required: true,
        trim: true
    },
    userID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    score: {
        type: Number,
        default: 0
    },
    problems: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("User", userSchema);