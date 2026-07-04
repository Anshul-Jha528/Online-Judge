const mongoose = require('mongoose');

const SubmissionsSchema = new mongoose.Schema({
    submissionID:{
        type: String,
        required: true,
        trim: true
    },
    problemID: {
        type: String,
        required:true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    verdict: {
        type: String,
        required: true,
        trim: true
    },
    submissionTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("Submissions", SubmissionsSchema);