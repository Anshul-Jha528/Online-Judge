const express = require('express');
const router = express.Router();
const {getAllProblems, getProblem, getTestCases} = require('../controller/UserProblemController');

router.get('/getAllProblems', getAllProblems);
router.get('/getProblem/:problemID', getProblem);
router.get('/getTestCases/:problemID', getTestCases);

module.exports = router;