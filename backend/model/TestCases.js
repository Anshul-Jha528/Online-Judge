const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    testCaseID: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    problemID: {
        type: String,
        required: true,
        trim: true
    },
    input: {
        type: String,
        required: true,
        trim: true
    },
    expectedOutput: {
        type: String,
        required: true,
        trim: true
    },
    isHidden: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("TestCase", testCaseSchema);