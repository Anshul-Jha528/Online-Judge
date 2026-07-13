const express = require('express');
const router = express.Router();
const {createProblem, updateProblem, deleteProblem, getProblem, getAllProblems, getAllTestCases, getTestCase, updateTestCase, deleteTestCase, createTestCase, createMultipleTestCases, getPendingAdminRequests, makeUserAdmin, rejectAdminRequest} = require('../controller/AdminProblemController');

router.post('/createProblem', createProblem);
router.patch('/updateProblem', updateProblem);
router.delete('/deleteProblem/:problemID', deleteProblem);
router.get('/getProblem/:problemID', getProblem);
router.get('/getAllProblems/:userID', getAllProblems);
router.get('/getTestCase/:problemID', getTestCase);
router.patch('/updateTestCase', updateTestCase);
router.delete('/deleteTestCase/:testCaseID', deleteTestCase);
router.post('/addTestCase/:problemID', createTestCase);
router.post('/addAllTestCases/:problemID', createMultipleTestCases);
router.get('/getAllTestCases/:problemID', getAllTestCases);
router.get('/adminRequests', getPendingAdminRequests);
router.post('/acceptRequest', makeUserAdmin)
router.post('/rejectRequest', rejectAdminRequest)

module.exports = router;
