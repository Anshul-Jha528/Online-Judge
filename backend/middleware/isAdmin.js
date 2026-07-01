const express = require('express');
const User = require('../model/Users');
const Users = require('../model/Users');

const isAdmin = async (req, res, next) => {
    try {

        const user = await Users.findOne({userID: req.user.userID});
        if(user.isAdmin){
            next();
        }else{
            return res.status(403).json({ message: "Access denied" });
        }
    } catch (error) {
        console.error("Error while checking admin status ", error);
        return res.status(500).json({ message: "Error validating admin credentials" });
    }
}

module.exports = isAdmin;