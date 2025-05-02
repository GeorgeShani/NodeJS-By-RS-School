import { resolveFilePath, directoryExists } from "../utils.js";
import path from "path";
import fs from "fs";

// Navigate to parent directory
const navigateUp = () => {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);

  // Check if trying to go above root directory
  if (parentDir === currentDir) {
    return; // Do nothing if at root
  }

  process.chdir(parentDir);
};

// Change to specified directory
const changeDirectory = (targetPath) => {
  try {
    // Handle both absolute and relative paths
    const newPath = resolveFilePath(targetPath);

    // Check if directory exists
    if (!directoryExists(newPath)) {
      throw new Error("Directory does not exist");
    }

    process.chdir(newPath);
  } catch (error) {
    throw new Error("Invalid directory");
  }
};

// List contents of current directory
const listDirectoryContents = async () => {
  try {
    const dirPath = process.cwd();
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    // Separate directories and files
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({ name: entry.name, type: "directory" }));

    const files = entries
      .filter((entry) => entry.isFile())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({ name: entry.name, type: "file" }));

    // Combine sorted directories and files
    const sortedEntries = [...directories, ...files];

    // Format and print the result
    const typeColWidth = Math.max(...sortedEntries.map((e) => e.type.length), "Type".length) + 4;
    const nameColWidth = Math.max(...sortedEntries.map((e) => e.name.length), "Name".length) + 4;

    // Header
    console.log("Type".padEnd(typeColWidth) + "Name".padEnd(nameColWidth));
    console.log("-".repeat(typeColWidth + nameColWidth));

    // Rows
    sortedEntries.forEach((entry) => {
      console.log(entry.type.padEnd(typeColWidth) + entry.name.padEnd(nameColWidth));
    });
  } catch (error) {
    throw new Error("Failed to list directory contents");
  }
};

export { navigateUp, changeDirectory, listDirectoryContents };