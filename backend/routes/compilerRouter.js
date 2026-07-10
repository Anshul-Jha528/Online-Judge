const express = require('express');
const router = express.Router();
const {run, submit} = require('../controller/CompileController');

router.post('/run', run);
router.post('/submit',submit);

module.exports = router;