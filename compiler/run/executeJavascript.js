const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const executeJavascript = async (filePath, inputFilePath) => {
    const jobID = path.basename(filePath).split('.')[0];

    return new Promise((resolve, reject)=>{
        const command = `node "${filePath}" < "${inputFilePath}"`;
        console.log(command);
        exec(
            command,
            (error, stdout, stderr)=>{
                if(error){
                    reject({error, stderr});
                }
                if(stderr){
                    reject(stderr);
                }
                resolve(stdout);
            }
        )

    })

}

module.exports = {
    executeJavascript
}