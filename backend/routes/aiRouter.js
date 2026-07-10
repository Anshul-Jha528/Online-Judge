const express = require('express');
const {askAI} = require('../controller/aiController');

const router = express.Router();

router.post('/askAI', askAI);

module.exports = router;