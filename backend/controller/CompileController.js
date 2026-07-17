const axios = require("axios");
const TestCases = require("../model/TestCases");
const Submissions = require("../model/Submissions");
const Counter = require("../model/Counter");
const User = require("../model/Users");
const Problem = require("../model/Problems");

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
    try {
        const { language, code, problemID } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Code is required"
            });
        }

        const testCases = await TestCases.find({ problemID }).sort({ testCaseID: 1 });

        if (testCases.length === 0) {
            return res.status(404).json({
                message: "No test cases found for this problem."
            });
        }

        let verdict = "Accepted";
        let testCaseNumber = 1;

        for (const testCase of testCases) {
            try {
                const compilerRes = await axios.post(
                    `${process.env.COMPILER_URI}/run`,
                    {
                        language,
                        code,
                        input: testCase.input
                    }
                );

                if (compilerRes.data.verdict) {
                    const compilerVerdict = compilerRes.data.verdict;

                    if (
                        compilerVerdict === "Time Limit Exceeded" ||
                        compilerVerdict === "Memory Limit Exceeded" ||
                        compilerVerdict === "Runtime Error" ||
                        compilerVerdict === "Compilation Error"
                    ) {
                        verdict = compilerVerdict;
                        break;
                    }
                }

                const output = compilerRes.data.output;

                if (!compare(testCase.expectedOutput, output)) {
                    verdict = `Wrong Answer on test case ${testCaseNumber}`;
                    break;
                }

                testCaseNumber++;
            } catch (err) {
                verdict = "Compilation Error";
                break;
            }
        }
        let points = 0;

        if (verdict === "Accepted") {
            const previousAccepted = await Submissions.exists({
                userID: req.user.userID,
                problemID,
                verdict: "Accepted"
            });

            if (!previousAccepted) {
                const problem = await Problem.findOne({problemID});


                const score =
                    problem.difficulty === "Easy"? 10
                        : problem.difficulty === "Medium"? 20
                        : problem.difficulty === "Hard"? 30
                        : 0;
                points = score;

                console.log(problem);
                console.log(score);

                await User.updateOne(
                    { userID: req.user.userID },
                    {
                        $inc: {
                            score:score,
                            problems: 1
                        }
                    }
                );
            }
        }

        const submissionID = await getSubId();

        await new Submissions({
            submissionID,
            problemID,
            language,
            code,
            verdict,
            userID: req.user.userID,
            submissionTime: new Date()
        }).save();

        return res.status(200).json({
            verdict,
            points
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: `Submission failed: ${err.message}`
        });
    }
};

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