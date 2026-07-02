const express = require('express');
const router = express.Router();
const {createProblem, updateProblem, deleteProblem, getProblem, getAllProblems, getTestCase, updateTestCase, deleteTestCase} = require('../controller/AdminProblemController')

router.post('/createProblem', createProblem);
router.patch('/updateProblem', updateProblem);
router.delete('/deleteProblem/:problemID', deleteProblem);
router.get('/getProblem/:problemID', getProblem);
router.get('/getAllProblems/:userID', getAllProblems);
router.get('/getTestCase/:problemID', getTestCase);
router.patch('/updateTestCase', updateTestCase);
router.delete('/deleteTestCase/:testCaseID', deleteTestCase)

module.exports = router;
