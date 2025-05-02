import { compressFile, decompressFile } from "./commands/compression.js";
import { calculateHash } from "./commands/hash.js";
import { getOSInfo } from "./commands/osInfo.js";
import { printCurrentDir } from "./utils.js";
import readline from "readline";
import {
  navigateUp,
  changeDirectory,
  listDirectoryContents,
} from "./commands/navigation.js";
import {
  readFile,
  createEmptyFile,
  createDirectory,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
} from "./commands/fileOperations.js";

// Set up CLI interface
const setupCLI = (username) => {
  const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  // Handle exit when clicking Ctrl + C
  process.on("SIGINT", () => {
    exitHandler(username, cliInterface);
  });

  cliInterface.on("line", async (input) => {
    try {
      if (input.trim() === ".exit") {
        exitHandler(username, cliInterface);
        return;
      }

      await processCommand(input.trim());
    } catch (error) {
      console.log("Operation failed");
    }

    printCurrentDir();
    cliInterface.prompt();
  });

  cliInterface.prompt();
};

// Handle exit with ".exit" command
const exitHandler = (username, cliInterface) => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  cliInterface.close();
  process.exit(0);
};

// Process user commands
const processCommand = async (input) => { 
  const [command, ...args] = input.split(" ");

  try {
    switch (command) {
      // Navigation commands
      case "up":
        navigateUp();
        break;
      case "cd":
        if (!args[0]) throw new Error("Missing path argument");
        changeDirectory(args[0]);
        break;
      case "ls":
        await listDirectoryContents();
        break;

      // File operations
      case "cat":
        if (!args[0]) throw new Error("Missing file path");
        await readFile(args[0]);
        break;
      case "add":
        if (!args[0]) throw new Error("Missing file name");
        await createEmptyFile(args[0]);
        break;
      case "mkdir":
        if (!args[0]) throw new Error("Missing directory name");
        await createDirectory(args[0]);
        break;
      case "rn":
        if (!args[0] || !args[1]) throw new Error("Missing arguments");
        await renameFile(args[0], args[1]);
        break;
      case "cp":
        if (!args[0] || !args[1]) throw new Error("Missing arguments");
        await copyFile(args[0], args[1]);
        break;
      case "mv":
        if (!args[0] || !args[1]) throw new Error("Missing arguments");
        await moveFile(args[0], args[1]);
        break;
      case "rm":
        if (!args[0]) throw new Error("Missing file path");
        await deleteFile(args[0]);
        break;

      // OS info commands
      case "os":
        if (!args[0]) throw new Error("Missing OS info parameter");
        getOSInfo(args[0]);
        break;

      // Hash calculation
      case "hash":
        if (!args[0]) throw new Error("Missing file path");
        await calculateHash(args[0]);
        break;

      // Compression/Decompression
      case "compress":
        if (!args[0] || !args[1]) throw new Error("Missing arguments");
        await compressFile(args[0], args[1]);
        break;
      case "decompress":
        if (!args[0] || !args[1]) throw new Error("Missing arguments");
        await decompressFile(args[0], args[1]);
        break;

      default:
        console.error("Invalid input");
    }
  } catch (error) {
    console.error("Operation failed");
  }
};

export { setupCLI };