const { exec } = require("child_process");

const executePython = async (filePath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        const command = `python3 "${filePath}" < "${inputFilePath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) return reject(stderr || error.message);
            if (stderr) return reject(stderr);
            resolve(stdout);
        });
    });
};

module.exports = { executePython };