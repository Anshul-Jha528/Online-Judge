const fs = require("fs");
const path = require('path');
const {v4:uuid} = require('uuid');

const dirTemp = path.join(__dirname, 'temp');

const getExtension = (language) => {
    if(language === "cpp") return "cpp";
    if(language === "java") return "java";
    if(language === "python") return "py";
    if(language === "javascript") return "js";
}

const getDirectoryPath = (language, code, input) => {
    const id = uuid();
    const jobDir = path.join(dirTemp, id);
    fs.mkdirSync(jobDir, {recursive:true});
    const ext = getExtension(language);
    const codeFile = path.join(jobDir,`Main.${ext}`);
    const inputFile = path.join(jobDir,'input.txt');
    

    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, input);
    
    return jobDir;
}

module.exports = {
    getDirectoryPath
}