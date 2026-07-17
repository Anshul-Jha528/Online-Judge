const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const executeJavascript = async (dirPath) => {
    const filePath = path.join(dirPath, `Main.js`);
    const inputFilePath = path.join(dirPath, 'input.txt');

    return new Promise((resolve, reject)=>{
        const command = `node --max-old-space-size=200 "${filePath}" < "${inputFilePath}"`;
        exec(
            command,
            {timeout: 4000},
            (error, stdout, stderr)=>{
                if (error) {

                    if (
                        error.killed ||
                        error.signal === "SIGTERM" ||
                        error.code === null
                    ) {
                        return reject({
                            verdict: "Time Limit Exceeded"
                        });
                    }

                     const errMsg =
                        `${stderr || ""}\n${error.message || ""}`.toLowerCase();

                    // Memory Limit Exceeded
                    if (
                        errMsg.includes("outofmemoryerror") ||
                        errMsg.includes("could not reserve enough space") ||
                        errMsg.includes("cannot allocate memory") ||
                        errMsg.includes("memory exhausted") ||
                        errMsg.includes("cannot create gc thread") ||
                        errMsg.includes("native memory allocation") ||
                        errMsg.includes("virtual memory exhausted")
                    ) {
                        return reject({
                            verdict: "Memory Limit Exceeded"
                        });
                    }

                    return reject({
                        // verdict: "Compilation/Runtime Error",
                        error,
                        stderr
                    });
                }

                if (stderr) {
                    return reject({
                        verdict: "Runtime Error",
                        stderr
                    });
                }
                resolve(stdout);
            }
        )

    })

}

module.exports = {
    executeJavascript
}