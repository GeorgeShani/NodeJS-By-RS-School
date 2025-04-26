import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spawnChildProcess = async (args) => {
  // Construct full path to script.js
  const scriptPath = path.resolve(__dirname, "files", "script.js");

  // Spawn child process
  const childProcess = spawn("node", [scriptPath, ...args], {
    stdio: ["pipe", "pipe", "pipe", "ipc"], // Setup IPC channels
  });

  // Forward stdin from mster process to child process
  process.stdin.pipe(childProcess.stdin);

  // Forward stdout from child process to master process
  childProcess.stdout.pipe(process.stdout);

  // Handle errors
  childProcess.stderr.on("data", (data) => {
    console.error(`Child process error: ${data}`);
  });

  // Log when child process exits
  childProcess.on("exit", (code) => {
    console.log(`Child process exited with code ${code}`);
  });
};

// Put your arguments in function call to test this functionality
spawnChildProcess(["Hello", "from", "VS Code", "to", "RS", "School"]);
