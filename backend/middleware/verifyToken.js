const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // console.log(req.headers);
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized access!"});
        }
        // console.log(token);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next(); 
    } catch (error) {
        console.error("Error while verifying token ", error);
        res.status(401).json({message: "Invalid or expired token"});
    }
}

module.exports = verifyToken;