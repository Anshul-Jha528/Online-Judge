const Problem = require('../model/Problems');
const TestCase = require('../model/TestCases');
const Counter = require('../model/Counter');
const User = require('../model/Users');

const createProblem = async (req, res) => {
    try {
        const {title, statement, difficulty, topics, timeLimitMs, memoryLimitMB} = req.body;
        if(!title || !statement || !difficulty || !topics || !timeLimitMs || !memoryLimitMB){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingProblem = await Problem.findOne({title: title});
        if(existingProblem){
            return res.status(400).json({message: "Problem already exists"});
        }
        const problemID = await getProblemId();
        const authorID = req.user.userID;
        const user = await User.findOne({userID: authorID}).select("fullName");
        const authorName = user.fullName;
        const newProblem = new Problem({
            title: title,
            statement: statement,
            difficulty: difficulty,
            topics: topics,
            timeLimitMs: timeLimitMs,
            memoryLimitMB: memoryLimitMB,
            problemID: problemID,
            authorID: authorID,
            authorName: authorName
        });
        await newProblem.save();
        res.status(201).json({message: "Problem created successfully", problem: newProblem});
    } catch (error) {
        console.error("Error while creating problem ", error);
        res.status(500).json({message: "Error creating problem"});
    }
}

const getProblemId = async () => {
    const counter = await Counter.findOneAndUpdate(
        {name: "problem"},
        {$inc: {sequence_value: 1}},
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );
    return `P${counter.sequence_value}`;
}

const updateProblem = async (req, res) => {
    try {
        const {problemID, title, statement, difficulty, topics, timeLimitMs, memoryLimitMB} = req.body;
        if(!problemID || !title || !statement || !difficulty || !topics || !timeLimitMs || !memoryLimitMB){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingProblem = await Problem.findOne({problemID: problemID});
        if(!existingProblem){
            return res.status(400).json({message: "Problem not found"});
        }
        const existingTitle = await Problem.findOne({title: title});
        if(existingTitle && existingTitle.problemID !== problemID){
            return res.status(400).json({message: "Problem title already exists"});
        }
        existingProblem.title = title;
        existingProblem.statement = statement;
        existingProblem.difficulty = difficulty;
        existingProblem.topics = topics;
        existingProblem.timeLimitMs = timeLimitMs;
        existingProblem.memoryLimitMB = memoryLimitMB;
        await existingProblem.save();
        res.status(200).json({message: "Problem updated successfully", problem: existingProblem});
    } catch (error) {
        console.error("Error while updating problem ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteProblem = async (req, res) =>{
    try {
        const {problemID} = req.params;
        if(!problemID){
            return res.status(400).json({message: "Problem ID is required"});
        }
        const existingProblem = await Problem.findOne({problemID: problemID});
        if(!existingProblem){
            return res.status(400).json({message: "Problem not found"});
        }
        await Problem.deleteOne({problemID: problemID});
        await TestCase.deleteMany({problemID: problemID});
        res.status(200).json({message: "Problem deleted successfully"});
    } catch (error) {
        console.error("Error while deleting problem ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getProblem = async (req, res) =>{
    try {
        const {problemID} = req.params;
        if(!problemID){
            return res.status(400).json({message: "Problem ID is required"});
        }
        const existingProblem = await Problem.findOne({problemID: problemID});
        if(!existingProblem){
            return res.status(400).json({message: "Problem not found"});
        }
        res.status(200).json({message: "Problem found", problem: existingProblem});
    } catch (error) {
        console.error("Error while getting problem ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getTestCase = async (req, res) =>{
    try {
        const {problemID} = req.params;
        if(!problemID){
            return res.status(400).json({message: "Problem ID is required"});
        }
        const existingTestCase = await TestCase.find({problemID: problemID});
        if(existingTestCase.length === 0){
            return res.status(400).json({message: "Test case not found"});
        }
        res.status(200).json({message: "Test case found", testCases: existingTestCase});
    } catch (error) {
        console.error("Error while getting test case ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const updateTestCase = async (req, res) => {
    try{
        const {testCaseID, input, expectedOutput, isHidden} = req.body;
        if(!testCaseID || !input || !expectedOutput || !isHidden){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingTestCase = await TestCase.findOne({testCaseID: testCaseID});
        if(!existingTestCase){
            return res.status(400).json({message: "Test case not found"});
        }
        existingTestCase.input = input;
        existingTestCase.expectedOutput = expectedOutput;
        existingTestCase.isHidden = isHidden;
        await existingTestCase.save();
        res.status(200).json({message: "Test case updated successfully", testCase: existingTestCase});
    } catch (error) {
        console.error("Error while updating test case ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const createTestCase = async (req, res) => {
    try {
        const {problemID, input, expectedOutput, isHidden} = req.body;
        if(!problemID || !input || !expectedOutput || !isHidden){
            return res.status(400).json({message: "All fields are required"});
        }
        const testCaseID = await getTestCaseId();
        const newTestCase = new TestCase({
            problemID: problemID,
            testCaseID: testCaseID,
            input: input,
            expectedOutput: expectedOutput,
            isHidden: isHidden
        });
        await newTestCase.save();
        res.status(201).json({message: "Test case created successfully", testCase: newTestCase});
    } catch (error) {
        console.error("Error while creating test case ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getTestCaseId = async () => {
    const counter = await Counter.findOneAndUpdate(
        {name: "testcase"},
        {$inc: {sequence_value: 1}},
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );
    return `TC${counter.sequence_value}`;
}

const deleteTestCase = async (req, res) => {
    try {
        const {testCaseID} = req.params;
        if(!testCaseID){
            return res.status(400).json({message: "Test case ID is required"});
        }
        const existingTestCase = await TestCase.findOne({testCaseID: testCaseID});
        if(!existingTestCase){
            return res.status(400).json({message: "Test case not found"});
        }
        await TestCase.deleteOne({testCaseID: testCaseID});
        res.status(200).json({message: "Test case deleted successfully"});
    } catch (error) {
        console.error("Error while deleting test case ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { createProblem, updateProblem, deleteProblem, getProblem, getTestCase, updateTestCase, createTestCase, deleteTestCase };