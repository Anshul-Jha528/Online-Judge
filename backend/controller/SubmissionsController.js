const Submissions = require('../model/Submissions');
const Problems = require('../model/Problems');

const getAllMySubmissions = async (req, res) => {
    try {
        const userID = req.params.userID;
        const mySubmissions = await Submissions.aggregate([
            {
                $match: {
                    userID: userID
                }
            },
            {
                $lookup: {
                    from: "problems",
                    localField: "problemID",
                    foreignField: "problemID",
                    as: "problem"
                }
            },
            {
                $unwind: "$problem"
            },
            {
                $project: {
                    _id: 0,
                    submissionID: 1,
                    problemID: 1,
                    problemTitle: "$problem.title",
                    language: 1,
                    verdict: 1,
                    submissionTime: 1
                }
            },
            {
                $sort: {
                    submissionTime: -1
                }
            }
        ]);
        if (!mySubmissions) {
            return res.status(402).json({ message: "No submissions found" });
        }
        res.status(200).json({ submissions: mySubmissions });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Couldn't get submissions" });
    }
}

const getProblemSubmissions = async (req, res) => {
    try {
        const problemID = req.params.problemID;
        const submissions = await Submissions.find({ problemID: problemID }).sort({ submissionTime: -1 }).select("submissionID userID language verdict submissionTime -_id");
        if (!submissions) {
            return res.status(404).json({ message: "No submissions found" });
        }
        res.status(200).json({ submissions: submissions });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Couldn't get submissions" });
    }
}

const getOneSubmission = async (req, res) => {
    try {
        const submissionID = req.params.submissionID;
        const submission = await Submissions.findOne({ submissionID: submissionID }).select("submissionID problemID userID language verdict submissionTime code -_id");
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        res.status(200).json({ submission: submission });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Couldn't get submission" });
    }
}

module.exports = { getAllMySubmissions, getProblemSubmissions, getOneSubmission };