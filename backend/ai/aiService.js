const ai = require("./gemini");
const { SYSTEM_PROMPT } = require("./prompt");

const MODEL = "gemini-flash-lite-latest";

const generateResponse = async (prompt) => {
    try {
        // console.log(prompt);

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: (prompt),
        });

        return response.text;
    }
    catch (error) {
        console.error(error);

        throw new Error("Failed to generate AI response.");
    }
};

module.exports = {
    generateResponse,
};