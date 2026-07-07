const fs = require("fs");
const path = require('path');
const {v4:uuid} = require('uuid');

const dirCodes = path.join(__dirname, 'inputs');

if (!(fs.existsSync(dirCodes))) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const getInputFilePath = async (code) => {
    const id = uuid();
    const ext = "txt";
    const filePath = path.join(dirCodes, `${id}.${ext}`);

    await fs.writeFileSync(filePath, code);
    return filePath;
}

module.exports = {
    getInputFilePath
}