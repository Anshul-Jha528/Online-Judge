const { generateResponse } = require("../ai/aiService");
const Problem = require('../model/Problems');
const {SYSTEM_PROMPT} = require("../ai/prompt");

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

module.exports = { askAI };