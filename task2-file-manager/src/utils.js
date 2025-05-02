import path from "path";
import fs from "fs";

// Parse CLI arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  const username =
    args.find((arg) => arg.startsWith("--username="))?.split("=")[1] ||
    "Anonymous";

  return { username };
};

// Resolve file paths (relatives or absolute)
const resolveFilePath = (inputPath) => {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.join(process.cwd(), inputPath);
};

// Check if a file exists and is a file (not a directory)
const fileExists = (filePath) => {
  const resolvedPath = resolveFilePath(filePath);
  return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile();
};

// Check if a directory exists and is a directory (not a file)
const directoryExists = (dirPath) => {
  const resolvedPath = resolveFilePath(dirPath);
  return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory();
};

// Print current working directory
const printCurrentDir = () => {
  console.log(`You are currently in ${process.cwd()}`);
};

export {
  parseArgs,
  resolveFilePath,
  fileExists,
  directoryExists,
  printCurrentDir,
};
