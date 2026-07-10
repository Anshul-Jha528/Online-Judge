const axios = require("axios");
const TestCases = require("../model/TestCases");
const Submissions = require("../model/Submissions");
const Counter = require("../model/Counter");

const run = async (req, res) => {
    try{
        const {language, code, input} = req.body;
        if(code==undefined){
            res.status(400).json({"message":"Code is required"});
        }
        const output = await axios.post(`${process.env.COMPILER_URI}/run`,
            {
                "language":language,
                "code": code,
                "input": input
            }
        )
        res.status(200).json({"output":output.data});
    }catch(err){
        console.log(err.message);
        res.status(500).json("mesage", `Compilation failed ${err.message}`);
    }
}

const submit = async (req, res) => {
    try{
        const {language, code, problemID} = req.body;
        console.log(language, problemID, code);
        if(code==undefined){
            return res.status(400).json({"message":"Code is required"});
        }
        const testCases = await TestCases.find({problemID:problemID}).sort({testCaseID:1});
        let i=0;
        let verdict="Accepted";
        console.log(testCases);
        for (const testCase of testCases) {
            const input = testCase.input;
            const expectedOutput = testCase.expectedOutput;
            const testCaseOutput = await axios.post(`${process.env.COMPILER_URI}/run`,
            {
                "language":language,
                "code": code,
                "input": input
            }
            )
            console.log(testCaseOutput.data.output, expectedOutput)
            const result = compare(expectedOutput, testCaseOutput.data.output);
            if(!result){
                verdict=`Wrong Answer on test case ${i+1}`;
                break;
            }
            i++;
        }
        const subID = await getSubId();
        const newSubmission = new Submissions({
            submissionID:subID,
            problemID:problemID,
            language:language,
            code:code,
            verdict:verdict,
            userID: req.user.userID,
            submissionTime : Date.now(),
            
        })
        await newSubmission.save();
        return res.status(200).json({"verdict":verdict});
    }catch(err){
        console.log(err.message);
        return res.status(400).json({"message": `Compilation failed ${err.message}`});
    }
}

const compare = (s1, s2) =>{
    s1=s1.trim();
    s2=s2.trim();
    if(s1==s2)return true;
    else return false;
}


const getSubId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "submission" },
        { $inc: { sequence_value: 1 } },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );
    return `SUB${counter.sequence_value}`;
}

module.exports={run, submit};