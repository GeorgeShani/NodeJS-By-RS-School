import { promises as fs } from "fs";
import { join } from "path";

const remove = async () => {
  const filePath = join("src", "fs", "files", "fileToRemove.txt");

  try {
    // Check if 'fileToRemove.txt' exists
    await fs.access(filePath);

    // Delete the file
    await fs.unlink(filePath);
    console.log("File deleted successfully.");
  } catch (error) {
    console.error(error.message);
    throw new Error("FS operation failed");
  }
};

await remove();
