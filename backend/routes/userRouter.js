const express = require('express');
const router = express.Router();
const {getAllProblems, getProblem, getTestCases} = require('../controller/UserProblemController');
const {getLeaderboard} = require('../controller/LeaderboardController');
const {getAllMySubmissions, getOneSubmission, getProblemSubmissions} = require('../controller/SubmissionsController');

router.get('/getAllProblems', getAllProblems);
router.get('/getProblem/:problemID', getProblem);
router.get('/getTestCases/:problemID', getTestCases);
router.get('/getLeaderboard', getLeaderboard);
router.get('/getMySubmissions/:userID', getAllMySubmissions);
router.get('/getOneSubmission/:submissionID', getOneSubmission);
router.get('/getProblemSubmissions/:problemID', getProblemSubmissions);

module.exports = router;