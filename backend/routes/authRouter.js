const express = require('express');
const router = express.Router();
const { registerUser, loginUser, makeUserAdmin } = require('../controller/AuthController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/makeUserAdmin', makeUserAdmin);


module.exports = router;