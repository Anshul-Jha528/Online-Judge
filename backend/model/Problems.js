const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    problemID:{
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    statement: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    topics: {
        type: [String],
        required: true,
        trim: true
    },
    timeLimitMs: {
        type: Number,
        required: true,
        trim: true
    },
    memoryLimitMB: {
        type: Number,
        required: true,
        trim: true
    },
    authorID: {
        type: String,
        required: true,
        trim: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Problem", problemSchema);
