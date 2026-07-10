const Problem = require('../model/Problems');
const TestCase = require('../model/TestCases');

const getAllProblems = async (req, res) => {
    try{
        const problems = await Problem.find().select(
            "problemID title difficulty topics"
        );
        res.status(200).json({message: "Problems found", problems: problems});
    } catch (error) {
        console.error("Error while getting problems ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { getAllProblems };

const getProblem = async (req, res) => {
    try {
        const {problemID} = req.params;
        if(!problemID){
            return res.status(400).json({message: "Problem ID is required"});
        }
        const problem = await Problem.findOne({problemID: problemID});
        if(!problem){
            return res.status(400).json({message: "Problem not found"});
        }
        res.status(200).json({message: "Problem found", problem: problem});
    } catch (error) {
        console.error("Error while getting problem ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getTestCases = async (req, res) =>{
    try {
        const {problemID} = req.params;
        if(!problemID){
            return res.status(400).json({message: "Problem ID is required"});
        }
        const testCases = (await TestCase.find({problemID: problemID, isHidden: false}).select("input expectedOutput"));
        if(testCases.length === 0){
            return res.status(400).json({message: "Test cases not found"});
        }
        res.status(200).json({message: "Test cases found", testCases: testCases});
    } catch (error) {
        console.error("Error while getting test cases ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { getAllProblems, getProblem, getTestCases };