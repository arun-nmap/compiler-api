const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json());

/* ==============================
   Health Check Route
============================== */
app.get('/', (req, res) => {
    res.send("🚀 Compiler API is running successfully!");
});

/* ==============================
   Compile & Run C Code
============================== */
app.post('/run', (req, res) => {

    const code = req.body.code;

    if (!code) {
        return res.status(400).json({
            success: false,
            error: "No code provided"
        });
    }

    // Create temporary folder
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'compiler-'));

    const filePath = path.join(tempDir, 'code.c');
    const outputPath = path.join(tempDir, 'output');

    fs.writeFileSync(filePath, code);

    const compileCommand = `gcc ${filePath} -o ${outputPath}`;

    exec(compileCommand, (compileError, compileStdErr) => {

        if (compileError) {
            return res.json({
                success: false,
                stage: "Compilation Error",
                error: compileStdErr
            });
        }

        exec(outputPath, { timeout: 5000 }, (runError, stdout, stderr) => {

            if (runError) {
                return res.json({
                    success: false,
                    stage: "Runtime Error",
                    error: stderr || runError.message
                });
            }

            return res.json({
                success: true,
                output: stdout
            });
        });
    });
});

/* ==============================
   Start Server
============================== */

const PORT = process.env.PORT || 80;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Compiler API running on port ${PORT}`);
});
