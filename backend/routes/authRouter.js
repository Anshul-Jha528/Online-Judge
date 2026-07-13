const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { registerUser, loginUser, getUserData, updateUserData, changePassword, removeUserAdmin, deleteAccount, requestAdminRights, isAdminRequestPending, withdrawAdminRequest } = require('../controller/AuthController');

router.post('/verifyToken', verifyToken, (req, res) => {
    res.status(200).json({message: "Token verified successfully", user: req.user});
});
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUserData/:userID', verifyToken, getUserData);
router.patch('/updateUserData', verifyToken, updateUserData);
router.patch('/changePassword', verifyToken, changePassword);
router.patch('/removeUserAdmin/:userID', verifyToken, removeUserAdmin);
router.delete('/deleteAccount/:userID', verifyToken, deleteAccount);
router.get('/isRequestPending', verifyToken, isAdminRequestPending);
router.post('/requestAdminRights', verifyToken, requestAdminRights);
router.post('/withdrawAdminRequest', verifyToken, withdrawAdminRequest)

module.exports = router;