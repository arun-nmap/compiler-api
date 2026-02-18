const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

// IMPORTANT: Must use PORT from Azure
const PORT = process.env.PORT || 80;

// Health check
app.get("/", (req, res) => {
  res.send("Compiler API Running 🚀");
});

// Compile C code
app.post("/run", (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const fs = require("fs");
  fs.writeFileSync("code.c", code);

  exec("gcc code.c -o output && ./output", (error, stdout, stderr) => {
    if (error) {
      return res.json({ output: stderr });
    }
    res.json({ output: stdout });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Compiler running on port ${PORT}`);
});
