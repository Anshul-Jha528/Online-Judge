const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./db');
const router = require("./routes/router");
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: false
}))

app.use(express.json());

app.use('/v1/', router)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("the server is running on port number ", PORT);
    // console.log(process.env.MONGODB_URI);
});