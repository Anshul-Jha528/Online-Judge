const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeCpp = async (dirPath) => {
    const filePath = path.join(dirPath, `Main.cpp`);
    const inputFilePath = path.join(dirPath, 'input.txt');

    return new Promise((resolve, reject) => {
        const command = `ulimit -v 262144 && g++ "${filePath}" -o "${dirPath}/Main" && "${dirPath}/Main" < "${inputFilePath}"`;

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
                        errMsg.includes("std::bad_alloc") ||
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
    });
};

module.exports = { executeCpp };