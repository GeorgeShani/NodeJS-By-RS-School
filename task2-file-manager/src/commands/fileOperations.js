import { resolveFilePath, fileExists, directoryExists } from "../utils.js";
import fs, { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import path from "path";

// Read and display file contents
const readFile = async (filePath) => {
  try {
    const resolvedPath = resolveFilePath(filePath);
    if (!fileExists(resolvedPath)) {
      throw new Error("File does not exist");
    }

    const readStream = createReadStream(resolvedPath);
    readStream.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    return new Promise((resolve, reject) => {
      readStream.on("end", () => {
        console.log(); // Add newline
        resolve();
      });

      readStream.on("error", reject);
    });
  } catch (error) {
    throw new Error("Failed to read file");
  }
};

// Create empty file
const createEmptyFile = async (fileName) => {
  try {
    const filePath = path.join(process.cwd(), fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      throw new Error("File already exists");
    }

    await fs.promises.writeFile(filePath, "");
  } catch (error) {
    throw new Error("Failed to create file");
  }
};

// Create new directory
const createDirectory = async (dirName) => {
  try {
    const dirPath = path.join(process.cwd(), dirName);

    // Check if directory already exists
    if (fs.existsSync(dirPath)) {
      throw new Error("Directory already exists");
    }

    await fs.promises.mkdir(dirPath);
  } catch (error) {
    throw new Error("Failed to create directory");
  }
};

// Rename file
const renameFile = async (oldPath, newFilename) => {
  try {
    const sourcePath = resolveFilePath(oldPath);

    // Check if source file exists
    if (!fileExists(sourcePath)) {
      throw new Error("Source file does not exist");
    }

    // Create the new path with the same directory but new filename
    const dirPath = path.dirname(sourcePath);
    const destPath = path.join(dirPath, newFilename);

    // Check if destination file already exists
    if (fs.existsSync(destPath)) {
      throw new Error("Destination file already exists");
    }

    await fs.promises.rename(sourcePath, destPath);
  } catch (error) {
    throw new Error("Failed to rename file");
  }
};

// Copy file
const copyFile = async (sourcePath, destDirPath) => {
  try {
    const resolvedSourcePath = resolveFilePath(sourcePath);
    const resolvedDestDir = resolveFilePath(destDirPath);

    // Check if source file exists
    if (!fileExists(resolvedSourcePath)) {
      throw new Error("Source file does not exist");
    }

    // Check if destination directory exists
    if (!directoryExists(resolvedDestDir)) {
      throw new Error("Destination directory does not exist");
    }

    const fileName = path.basename(resolvedSourcePath);
    const destPath = path.join(resolvedDestDir, fileName);

    // Create read and write streams
    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(destPath);

    // Use pipeline for proper error handling and cleanup
    await pipeline(readStream, writeStream);
  } catch (error) {
    throw new Error("Failed to copy file");
  }
};

// Move file (copy then delete)
const moveFile = async (sourcePath, destDirPath) => {
  try {
    // First copy the file
    await copyFile(sourcePath, destDirPath);

    // Then delete the original
    await deleteFile(sourcePath);
  } catch (error) {
    throw new Error("Failed to move file");
  }
};

// Delete file
const deleteFile = async (filePath) => {
  try {
    const resolvedPath = resolveFilePath(filePath);

    // Check if file exists
    if (!fileExists(resolvedPath)) {
      throw new Error("File does not exist");
    }

    await fs.promises.unlink(resolvedPath);
  } catch (error) {
    throw new Error("Failed to delete file");
  }
};

export {
  readFile,
  createEmptyFile,
  createDirectory,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
};
