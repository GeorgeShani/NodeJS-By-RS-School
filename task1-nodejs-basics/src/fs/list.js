import { promises as fs } from "fs";
import { join } from "path";

const list = async () => {
  const folderPath = join("src", "fs", "files");

  try {
    // Check if 'files' folder exists
    await fs.access(folderPath);

    // Read all filenames
    const files = await fs.readdir(folderPath);

    console.log(files);
  } catch (error) {
    console.error(error.message);
    throw new Error("FS operation failed");
  }
};

await list();