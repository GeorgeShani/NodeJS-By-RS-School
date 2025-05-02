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
    const directoryPath = process.cwd();

    // Read directory entries with file type information
    const entries = await fs.promises.readdir(directoryPath, {
      withFileTypes: true,
    });

    const detailedInfo = [];

    // Collect detailed information for each entry
    for (const entry of entries) {
      // Create full path by joining directory path and entry name
      const fullPath = path.join(directoryPath, entry.name);

      // Get detailed file/directory statistics
      const stats = await fs.promises.lstat(fullPath);

      // Add entry info to results array
      detailedInfo.push({
        Name: entry.name,
        Type: entry.isDirectory() ? "directory" : "file",
        Size: `${stats.size} B`, // Size in bytes
        Modified: stats.mtime.toLocaleString(), // Last modified time in locale format
      });
    }

    // Sort entries - directories first, then files, both alphabetically
    detailedInfo.sort((a, b) => {
      // If types are different, directories come before files
      if (a.Type !== b.Type) {
        return a.Type === "directory" ? -1 : 1;
      }
      // If types are the same, sort alphabetically by name
      return a.Name.localeCompare(b.Name);
    });

    // Display results in a formatted table
    console.table(detailedInfo);
  } catch (error) {
    throw new Error("Failed to list directory contents");
  }
};

export { navigateUp, changeDirectory, listDirectoryContents };