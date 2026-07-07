const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const executePython = async (filePath, inputFilePath) => {
    const jobID = path.basename(filePath).split('.')[0];

    return new Promise((resolve, reject)=>{
        const command = `python ${filePath} < ${inputFilePath}`;
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
    executePython
}