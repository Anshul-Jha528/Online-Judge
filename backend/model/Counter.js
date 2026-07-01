const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sequence_value: {
        type: Number,
        required: true,
        default: 100
    }
})

module.exports = mongoose.model("Counter", counterSchema);