import { promises as fs } from "fs";
import { join } from "path";

const read = async () => {
  const filePath = join("src", "fs", "files", "fileToRead.txt");
  
  try {
    // Check if 'fileToRead.txt' exists
    await fs.access(filePath);

    // Read file content
    const content = await fs.readFile(filePath, "utf-8");

    console.log(content);
  } catch (error) {
    console.error(error.message);
    throw new Error("FS operation failed");
  }
};

await read();