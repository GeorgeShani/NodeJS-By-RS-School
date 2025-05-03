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
  console.log(`\n📁 Current Directory: ${process.cwd()}`);
};

// Parse command respecting quotes
const parseCommandWithQuotes = (input) => { 
  const result = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Handle quotes (both single and double)
    if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = "";
      } else {
        // This is a different quote character inside quotes, treat as regular char
        current += char;
      }

      continue;
    }

    // Handle spaces as argument separators (only when not in quotes)
    if (char === " " && !inQuotes) {
      if (current) {
        result.push(current);
        current = "";
      }

      continue;
    }

    // Add regular characters to current argument
    current += char;
  }

  // Add the last argument if there is one
  if (current) {
    result.push(current);
  }

  return result;
};

export {
  parseArgs,
  resolveFilePath,
  fileExists,
  directoryExists,
  printCurrentDir,
  parseCommandWithQuotes
};
