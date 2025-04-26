import { promises as fs } from "fs";
import { join } from "path";

const rename = async () => {
  const oldPath = join("src", "fs", "files", "wrongFilename.txt");
  const newPath = join("src", "fs", "files", "properFilename.md");

  try {
    // Check if 'wrongFilename.txt' exists
    await fs.access(oldPath);

    // Check id 'properFilename.md already exists'
    try {
      await fs.access(newPath);
      // If access succeeds, it means 'properFilename.md' exists, so we throw error
      throw new Error("properFilename.md already exists");
    } catch {
      // If access fails, it means 'properFilename.md' does not exist — good, we proceed
    }

    // Perform renaming
    await fs.rename(oldPath, newPath);
    console.log("File renamed successfully.");
  } catch (error) {
    console.error(error.message);
    throw new Error("FS operation failed");
  }
};

await rename();