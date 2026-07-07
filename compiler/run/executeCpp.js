const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'outputs');

if (!(fs.existsSync(outputPath))) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
    const jobID = path.basename(filePath).split('.')[0];
    const outputFilePath = path.join(outputPath, `${jobID}.exe`);

    return new Promise((resolve, reject)=>{
        const command = `g++ ${filePath} -o ${outputFilePath} && cd ${outputPath} && ${jobID}.exe < ${inputFilePath}`;
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
    executeCpp
}