const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 80;

/* ================================
   Compile and Run C Code
=================================*/
app.post("/run", (req, res) => {

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    const uniqueId = Date.now();
    const workDir = path.join(__dirname, "workspace_" + uniqueId);

    fs.mkdirSync(workDir);

    const codeFile = path.join(workDir, "code.c");
    fs.writeFileSync(codeFile, code);

    const compileCommand = `
        gcc ${codeFile} -o ${workDir}/output &&
        timeout 5s ${workDir}/output
    `;

    exec(compileCommand, (error, stdout, stderr) => {

        let result;

        if (error) {
            result = stderr || error.message;
        } else {
            result = stdout;
        }

        // Cleanup
        fs.rmSync(workDir, { recursive: true, force: true });

        res.json({
            output: result.trim()
        });

    });

});

/* ================================
   Health Check
=================================*/
app.get("/", (req, res) => {
    res.send("Compiler API Running 🚀");
});

/* ================================
   Start Server
=================================*/
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Compiler running on port ${PORT}`);
});
