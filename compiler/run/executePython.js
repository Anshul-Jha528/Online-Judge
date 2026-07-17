const { exec } = require("child_process");
const path = require('path');

const executePython = async (dirPath) => {
    const filePath = path.join(dirPath, `Main.py`);
    const inputFilePath = path.join(dirPath, 'input.txt');
    return new Promise((resolve, reject) => {
        const command =  `ulimit -v 262144 && python3 ${filePath} < ${inputFilePath}`;

        exec(
            command,
            {timeout: 5000},
            (error, stdout, stderr)=>{
                if (error) {
                    console.log(error);

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
                        errMsg.includes("memoryerror") ||
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
                        // verdict: "Runtime Error",
                        stderr
                    });
                }
                resolve(stdout);
            }
        )
    });
};

module.exports = { executePython };