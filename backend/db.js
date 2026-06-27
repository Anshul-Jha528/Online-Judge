const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Error connecting to Database:', error);
        process.exit(1);
    }
};

module.exports = connectDB;