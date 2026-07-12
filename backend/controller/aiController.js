const { generateResponse } = require("../ai/aiService");
const Problem = require('../model/Problems');
const {SYSTEM_PROMPT, VERIFY_PROBLEM_PROMPT, AUTOCOMPLETE_PROBLEM_PROMPT, GENERATE_TEST_CASES_PROMPT, VERIFY_TEST_CASES_PROMPT} = require("../ai/prompt");

const askAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        const answer = await generateResponse(SYSTEM_PROMPT+" User query: "+prompt);

        return res.status(200).json({
            status: "success",
            answer
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to generate AI response.",
        });
    }
};

const verifyProblem = async (req,res) => {
    try{
        const { problem, title, difficulty, timeLimitMs, memoryLimitMB, topics } = req.body;
        const answer = await generateResponse(VERIFY_PROBLEM_PROMPT+problem+"Topics: "+topics.join(", "));
        return res.status(200).json({
            status: "success",
            score: answer
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to verify problem.",
        });
    }
}

const autocompleteProblem = async (req,res) => {
    try{
        const { problem} = req.body;
        const answer = await generateResponse(AUTOCOMPLETE_PROBLEM_PROMPT+problem);
        return res.status(200).json({
            status: "success",
            problem: answer
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to autocomplete problem.",
        });
    }
}

const generateTestCases = async (req,res) => {
    try{
        const {problemID, testCases} = req.body;
        if(!problemID){
            return res.status(400).json({
                status: "error",
                message: "Problem is required.",
            });
        }
        const existingTestCases = Array.isArray(testCases)
            ? testCases.join(", ")
            : "";
        const problem = await Problem.findOne({problemID:problemID});
        if(!problem){
            return res.status(400).json({
                status: "error",
                message: "Problem not found.",
            });
        }
        const result = await generateResponse(GENERATE_TEST_CASES_PROMPT+problem.statement+" Existing test cases: "+existingTestCases);
        const newTestCases = JSON.parse(result);
        return res.status(200).json({
            status: "success",
            testCases: newTestCases
        });

    } catch(err){
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Failed to generate test cases.",
        });
    }
}

const verifyTestCase = async (problemID, testCase) => {
    try{
        const problem = await Problem.findOne({problemID:problemID});
        if(!problem || !testCase){
            return "0";
        }
        const prompt = VERIFY_TEST_CASES_PROMPT+problem.statement+"Test case(s): "+testCase
        const answer = await generateResponse(prompt);
        
        console.log(answer);
        return answer;
    } catch(err){
        console.error(err);
        return "0";
    }
}

module.exports = { askAI, verifyProblem, autocompleteProblem, generateTestCases, verifyTestCase };