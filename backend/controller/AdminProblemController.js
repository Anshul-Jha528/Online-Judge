const Problem = require('../model/Problems');
const TestCase = require('../model/TestCases');
const Counter = require('../model/Counter');
const User = require('../model/Users');
const Problems = require('../model/Problems');
const {verifyTestCase} = require('./aiController'); 


const getPendingAdminRequests = async (req, res) =>{
    try{
        const existingUser = await User.find({isAdminRequestPending: true}).select("userID fullName email adminInfo");
        if(!existingUser){
            return res.status(400).json({ message: "No pending admin requests" });
        }
        res.status(200).json({ message: "Pending admin requests", requests: existingUser });
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const makeUserAdmin = async (req, res) => {
    try {
        const {userID} = req.body;
        if(!userID){
            return res.status(400).json({ message: "User ID is required" });
        }
        const existingUser = await User.findOne({userID: userID});
        if(!existingUser){
            return res.status(400).json({ message: "User not found" });
        }
        existingUser.isAdmin = true;
        existingUser.isAdminRequestPending = false;
        await existingUser.save();
        res.status(200).json({ message: "User made admin successfully"});
    } catch (error) {
        console.error("Error while making user admin ", error);
        res.status(500).json({ message: "Couldn't make admin" });
    }
}

const rejectAdminRequest = async (req, res) => {
    try{
        const {userID} = req.body;
        if(!userID){
            return res.status(400).json({ message: "User ID is required" });
        }
        const existingUser = await User.findOne({userID: userID});
        if(!existingUser){
            return res.status(400).json({ message: "User not found" });
        }
        existingUser.isAdminRequestPending = false;
        existingUser.adminInfo = "";
        await existingUser.save();
        res.status(200).json({ message: "Admin request rejected successfully" });
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const createProblem = async (req, res) => {
    try {
        const { title, statement, difficulty, topics, timeLimitMs, memoryLimitMB } = req.body;
        if (!title || !statement || !difficulty || !topics || !timeLimitMs || !memoryLimitMB) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingProblem = await Problem.findOne({ title: title });
        if (existingProblem) {
            return res.status(400).json({ message: "Problem already exists" });
        }
        const problemID = await getProblemId();
        const authorID = req.user.userID;
        const user = await User.findOne({ userID: authorID }).select("fullName");
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
        res.status(201).json({ message: "Problem created successfully", problem: newProblem });
    } catch (error) {
        console.error("Error while creating problem ", error);
        res.status(500).json({ message: "Error creating problem" });
    }
}

const getProblemId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "problem" },
        { $inc: { sequence_value: 1 } },
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
        const { problemID, title, statement, difficulty, topics, timeLimitMs, memoryLimitMB } = req.body;
        if (!problemID || !title || !statement || !difficulty || !topics || !timeLimitMs || !memoryLimitMB) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingProblem = await Problem.findOne({ problemID: problemID });
        if (!existingProblem) {
            return res.status(400).json({ message: "Problem not found" });
        }
        const existingTitle = await Problem.findOne({ title: title });
        if (existingTitle && existingTitle.problemID !== problemID) {
            return res.status(400).json({ message: "Problem title already exists" });
        }
        existingProblem.title = title;
        existingProblem.statement = statement;
        existingProblem.difficulty = difficulty;
        existingProblem.topics = topics;
        existingProblem.timeLimitMs = timeLimitMs;
        existingProblem.memoryLimitMB = memoryLimitMB;
        await existingProblem.save();
        res.status(200).json({ message: "Problem updated successfully", problem: existingProblem });
    } catch (error) {
        console.error("Error while updating problem ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteProblem = async (req, res) => {
    try {
        const { problemID } = req.params;
        if (!problemID) {
            return res.status(400).json({ message: "Problem ID is required" });
        }
        const existingProblem = await Problem.findOne({ problemID: problemID });
        if (!existingProblem) {
            return res.status(400).json({ message: "Problem not found" });
        }
        await Problem.deleteOne({ problemID: problemID });
        await TestCase.deleteMany({ problemID: problemID });
        res.status(200).json({ message: "Problem deleted successfully" });
    } catch (error) {
        console.error("Error while deleting problem ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllProblems = async (req, res) => {
    try {
        const userID = req.params.userID;
        const problems = await Problems.find({ authorID: userID });
        if (problems.length === 0) {
            return res.status(404).json({ message: "No problems found" });
        }
        res.status(200).json({ message: "Problems found", problems: problems });
    } catch (error) {
        console.error("Error while getting problems ", error);
        res.status(500).json({ message: "Error fetching problems" });
    }
}

const getProblem = async (req, res) => {
    try {
        const { problemID } = req.params;
        if (!problemID) {
            return res.status(400).json({ message: "Problem ID is required" });
        }
        const existingProblem = await Problem.findOne({ problemID: problemID });
        if (!existingProblem) {
            return res.status(400).json({ message: "Problem not found" });
        }
        res.status(200).json({ message: "Problem found", problem: existingProblem });
    } catch (error) {
        console.error("Error while getting problem ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTestCase = async (req, res) => {
    try {
        const { problemID } = req.params;
        if (!problemID) {
            return res.status(400).json({ message: "Problem ID is required" });
        }
        const existingTestCase = await TestCase.find({ problemID: problemID });
        if (existingTestCase.length === 0) {
            return res.status(400).json({ message: "Test case not found" });
        }
        res.status(200).json({ message: "Test case found", testCases: existingTestCase });
    } catch (error) {
        console.error("Error while getting test case ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllTestCases = async (req, res) => {
    try{
        const problemID = req.params.problemID;
        if(!problemID){
            return res.status(404).json({message:"Problem ID is required"});
        }
        const existingTestCase = await TestCase.find({problemID: problemID});
        if(existingTestCase.length === 0){
            return res.status(404).json({message:"Test case not found"});
        }
        res.status(200).json({message:"Test cases found",testCases:existingTestCase});
    }catch(error){
        console.error("Error while getting test cases ",error);
        res.status(500).json({message:"Internal server error"});
    }
}

const updateTestCase = async (req, res) => {
    try {
        // console.log(req.body);
        const { testCaseID, input, expectedOutput, isHidden } = req.body;
        if (!testCaseID || !expectedOutput) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingTestCase = await TestCase.findOne({ testCaseID: testCaseID });
        if (!existingTestCase) {
            return res.status(400).json({ message: "Test case not found" });
        }
        const isValid = await verifyTestCase(existingTestCase.problemID, JSON.stringify({
            input: input,
            expectedOutput: expectedOutput,
        }));
        console.log(isValid);
        if(!(isValid==='1')){
            return res.status(400).json({ message: isValid });
        }
        existingTestCase.input = input;
        existingTestCase.expectedOutput = expectedOutput;
        existingTestCase.isHidden = isHidden;
        await existingTestCase.save();
        res.status(200).json({ message: "Test case updated successfully", testCase: existingTestCase });
    } catch (error) {
        console.error("Error while updating test case ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const createTestCase = async (req, res) => {
    try {
        const { problemID } = req.params;
        const { input, expectedOutput, isHidden } = req.body;
        if (!problemID || !expectedOutput) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const isValid = await verifyTestCase(problemID, JSON.stringify({
            input: input,
            expectedOutput: expectedOutput,
        }));
        if(!(isValid==='1')){
            return res.status(400).json({ message: isValid });
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
        res.status(201).json({ message: "Test case created successfully", testCase: newTestCase });
    } catch (error) {
        console.error("Error while creating test case ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const createMultipleTestCases = async (req, res) => {
    try {
        console.log(req.body);
        const { problemID } = req.params;
        const { testCases } = req.body;
        if (!problemID || !testCases) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const isValid = await verifyTestCase(problemID, JSON.stringify({
            input: testCases.map(testCase => testCase.input),
            expectedOutput: testCases.map(testCase => testCase.expectedOutput),
        }));
        if(!(isValid==='1')){
            return res.status(400).json({ message: isValid });
        }
        const createdTestCases = [];
        for (const testCase of testCases) {
            const testCaseID = await getTestCaseId();
            const newTestCase = new TestCase({
                problemID: problemID,
                testCaseID: testCaseID,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                isHidden: testCase.isHidden
            });
            await newTestCase.save();
            createdTestCases.push(newTestCase);
        }
        res.status(201).json({ message: "Test cases created successfully", testCases: createdTestCases });
    } catch (error) {
        console.error("Error while creating test cases ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTestCaseId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "testcase" },
        { $inc: { sequence_value: 1 } },
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
        const { testCaseID } = req.params;
        if (!testCaseID) {
            return res.status(400).json({ message: "Test case ID is required" });
        }
        const existingTestCase = await TestCase.findOne({ testCaseID: testCaseID });
        if (!existingTestCase) {
            return res.status(400).json({ message: "Test case not found" });
        }
        await TestCase.deleteOne({ testCaseID: testCaseID });
        res.status(200).json({ message: "Test case deleted successfully" });
    } catch (error) {
        console.error("Error while deleting test case ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {getPendingAdminRequests, makeUserAdmin, rejectAdminRequest, createProblem, updateProblem, deleteProblem, getAllProblems, getProblem, getAllTestCases, getTestCase, updateTestCase, createTestCase, deleteTestCase, createMultipleTestCases };