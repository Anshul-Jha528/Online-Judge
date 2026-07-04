const Users = require('../model/Users');

const getLeaderboard = async(req, res) => {
    try{
        const users = await Users.find().sort({score: -1}).select("fullName userID score problems -_id");
        if(!users){
            return res.status(402).json({ message: "No users found" });
        }
        res.status(200).json({ users: users });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Couldn't get leaderboard" });
    }
}

module.exports = { getLeaderboard };