import { parseArgs, printCurrentDir } from "./utils.js";
import { setupCLI } from "./cli.js";
import os from "os";

// Initialize file manager
const initFileManager = () => {
  const { username } = parseArgs();

  // Set initial working directory to user's home directory
  process.chdir(os.homedir());

  console.log(`👋 Hello, ${username}! Welcome to your File Manager.`);
  console.log(`ℹ️  Type "man" to view the list of available commands.`);
  printCurrentDir();

  // Set up CLI interface
  setupCLI(username);
};

initFileManager();
