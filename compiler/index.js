const express = require('express');
const { getDirectoryPath } = require('./getFilePath');
const {executeCpp} = require('./run/executeCpp');
const {executePython} = require('./run/executePython');
const {executeJavascript} = require('./run/executeJavascript');
const {executeJava} = require('./run/executeJava');
const {cleanup} = require('./cleanup');

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
    let dirPath;
    try{
         dirPath = getDirectoryPath(language, code, input);
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

        const output = await executor(dirPath);
        res.json({
            success: true,
        output
    });
    }catch(err){
        console.log(err);
        let error = err.verdict || err.stderr || err.error?.message || err.message || "Compilation/Runtime Error" 
        if(error)
        error = error?.replace(
            /.*[\\/].+\.(cpp|java|py|js):(\d+):(\d+):/g,
            "Line $2, Column $3:"
        );
        error ="Error: \n"+ error?.replace(
             /^.*[\\/].+\.(cpp|java|py|js):.*$\r?\n?/gm,
             ""
        );
        return res.status(200).json({
            success: false,
            output: error || err.error || err.stdout || err.message
        });
    }finally{
        console.log(dirPath);
        
        if(dirPath)
        cleanup(dirPath);
    }

})