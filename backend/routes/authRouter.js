const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { registerUser, loginUser, getUserData, updateUserData, changePassword, makeUserAdmin, removeUserAdmin, deleteAccount } = require('../controller/AuthController');

router.post('/verifyToken', verifyToken, (req, res) => {
    res.status(200).json({message: "Token verified successfully", user: req.user});
});
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUserData/:userID', verifyToken, getUserData);
router.patch('/updateUserData', verifyToken, updateUserData);
router.patch('/changePassword', verifyToken, changePassword);
router.post('/makeUserAdmin', verifyToken, makeUserAdmin);
router.patch('/removeUserAdmin/:userID', verifyToken, removeUserAdmin);
router.delete('/deleteAccount/:userID', verifyToken, deleteAccount);

module.exports = router;