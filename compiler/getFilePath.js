const fs = require("fs");
const path = require('path');
const {v4:uuid} = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!(fs.existsSync(dirCodes))) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const getExtension = (language) => {
    if(language === "cpp") return "cpp";
    if(language === "java") return "java";
    if(language === "python") return "py";
    if(language === "javascript") return "js";
}

const getFilePath = async (language, code) => {
    const id = uuid();
    const ext = getExtension(language);
    const filePath = path.join(dirCodes, `${id}.${ext}`);

    await fs.writeFileSync(filePath, code);
    return filePath;
}

module.exports = {
    getFilePath
}