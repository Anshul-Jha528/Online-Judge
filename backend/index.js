const express = require("express");
// const routes = require("./routes/routes");
// const connectDB = require("./database/db");

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("the server is running on port number 3000");
});