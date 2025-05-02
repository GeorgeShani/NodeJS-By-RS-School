import { parseArgs, printCurrentDir } from "./utils.js";
import { setupCLI } from "./cli.js";
import os from "os";

// Initialize file manager
const initFileManager = () => {
  const { username } = parseArgs();

  // Set initial working directory to user's home directory
  process.chdir(os.homedir());

  console.log(`Welcome to the File Manager, ${username}!`);
  printCurrentDir();

  // Set up CLI interface
  setupCLI(username);
};

initFileManager();
