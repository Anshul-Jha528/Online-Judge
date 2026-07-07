const express = require('express');
const { getFilePath } = require('./getFilePath');
const { getInputFilePath } = require('./getInputFilePath');
const {executeCpp} = require('./run/executeCpp');
const {executePython} = require('./run/executePython');
const {executeJavascript} = require('./run/executeJavascript');
const {executeJava} = require('./run/executeJava');

const app = express();

app.use(express.json());

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/run', async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined || code === null || code.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Code is required'
        });
    }
    try{
        const filePath = await getFilePath(language, code);
        const inputFilePath = await getInputFilePath(input);
        const executors = {
            cpp: executeCpp,
            python: executePython,
            javascript: executeJavascript,
            java: executeJava,
        };

        const executor = executors[language];

        if (!executor) {
            throw new Error(`Unsupported language: ${language}`);
        }

        const output = await executor(filePath, inputFilePath);
        res.json({
            success: true,
        output
    });
    }catch(err){
        let error = err.stderr.replace(
            /.*[\\/].+\.(cpp|java|py|js):(\d+):(\d+):/g,
            "Line $2, Column $3:"
        );
        error ="Error: \n"+ error.replace(
             /^.*[\\/].+\.(cpp|java|py|js):.*$\r?\n?/gm,
             ""
        );
        return res.status(200).json({
            success: false,
            output: error || err.stdout || err.message
        });
    }

})