const express = require('express');
const {askAI, verifyProblem, autocompleteProblem, generateTestCases} = require('../controller/aiController');

const router = express.Router();

router.post('/askAI', askAI);
router.post('/verifyProblem', verifyProblem);
router.post('/autocompleteProblem', autocompleteProblem);
router.post('/generateTestCases', generateTestCases);

module.exports = router;