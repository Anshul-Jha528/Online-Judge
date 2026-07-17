const fs = require('fs');

const cleanup = async (dirPath) => {
    try {
        fs.rmSync(dirPath, {
            recursive: true,
            force: true,
        });
    } catch (err) {
        console.error("Cleanup failed:", err);
    }
};

module.exports = {cleanup};