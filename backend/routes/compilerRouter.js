const express = require('express');
const router = express.Router();
const {run} = require('../controller/CompileController');

router.post('/run', run);

module.exports = router;