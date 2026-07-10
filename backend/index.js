const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./db');
const authRouter = require("./routes/authRouter");
const adminRouter = require('./routes/adminRouter')
const userRouter = require('./routes/userRouter')
const compilerRouter = require('./routes/compilerRouter')
const aiRouter = require('./routes/aiRouter')
const cors = require('cors');
const verifyToken = require('./middleware/verifyToken')
const isAdmin = require('./middleware/isAdmin')

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: false
}))

app.use(express.json());

app.use('/v1/auth/', authRouter);
app.use('/v1/admin/', verifyToken, isAdmin, adminRouter);
app.use('/v1/user/', verifyToken, userRouter);
app.use('/v1/compile', verifyToken, compilerRouter);
app.use('/v1/ai', verifyToken, aiRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("the server is running on port number ", PORT);
    // console.log(process.env.MONGODB_URI);
});