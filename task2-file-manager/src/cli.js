import { compressFile, decompressFile } from "./commands/compression.js";
import { printCurrentDir, parseCommandWithQuotes } from "./utils.js";
import { calculateHash } from "./commands/hash.js";
import { getOSInfo } from "./commands/osInfo.js";
import { showManual } from "./commands/man.js";
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
  cliInterface.on("SIGINT", () => {
    exitHandler(username, cliInterface);
  });

  // Handle Ctrl + L for clear screen
  process.stdin.setRawMode(true);
  process.stdin.on("data", (key) => {
    if (key.toString() === "\x0c") { // Ctrl + L
      console.clear();

      printCurrentDir()
      cliInterface.prompt();
    }
  });

  cliInterface.on("line", async (input) => {
    try {
      // Handle exit with ".exit" command
      if (input.trim() === ".exit") {
        exitHandler(username, cliInterface);
        return;
      }

      await processCommand(input.trim());
    } catch (error) {
      console.error(`"Operation failed": ${error.message}`);
    }

    printCurrentDir();
    cliInterface.prompt();
  });

  cliInterface.prompt();
};

const exitHandler = (username, cliInterface) => {
  console.log(
    `👋 Farewell, ${username}! Thanks for using the File Manager. Until next time — stay organized!`
  );
  cliInterface.close();
  process.exit(0);
};

// Process user commands
const processCommand = async (input) => {
  // Parse the input while respecting quotes
  const args = parseCommandWithQuotes(input);

  if (args.length === 0) {
    throw new Error("Empty command");
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      // Navigation commands
      case "up":
        navigateUp();
        break;
      case "cd":
        if (!commandArgs[0]) throw new Error("Missing path argument");
        changeDirectory(commandArgs[0]);
        break;
      case "ls":
        await listDirectoryContents();
        break;

      // File operations
      case "cat":
        if (!commandArgs[0]) throw new Error("Missing file path");
        await readFile(commandArgs[0]);
        break;
      case "add":
        if (!commandArgs[0]) throw new Error("Missing file name");
        await createEmptyFile(commandArgs[0]);
        break;
      case "mkdir":
        if (!commandArgs[0]) throw new Error("Missing directory name");
        await createDirectory(commandArgs[0]);
        break;
      case "rn":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await renameFile(commandArgs[0], commandArgs[1]);
        break;
      case "cp":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await copyFile(commandArgs[0], commandArgs[1]);
        break;
      case "mv":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await moveFile(commandArgs[0], commandArgs[1]);
        break;
      case "rm":
        if (!commandArgs[0]) throw new Error("Missing file path");
        await deleteFile(commandArgs[0]);
        break;

      // OS info commands
      case "os":
        if (!commandArgs[0]) throw new Error("Missing OS info parameter");
        getOSInfo(commandArgs[0]);
        break;

      // Hash calculation
      case "hash":
        if (!commandArgs[0]) throw new Error("Missing file path");
        await calculateHash(commandArgs[0]);
        break;

      // Compression/Decompression
      case "compress":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await compressFile(commandArgs[0], commandArgs[1]);
        break;
      case "decompress":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await decompressFile(commandArgs[0], commandArgs[1]);
        break;

      // Help/Manual
      case "man":
        showManual(commandArgs[0]);
        break;

      case "clear":
        console.clear();
        break;

      default:
        console.error("Invalid input");
    }
  } catch (error) {
    console.error(`Operation failed for command: '${input}'`);
    if (error.message) {
      console.error(`Error: ${error.message}`);
    }
  }
};

export { setupCLI };
