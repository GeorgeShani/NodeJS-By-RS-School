import { promises as fs } from "fs";
import { join } from "path";

const copy = async () => {
  const src = join("src", "fs", "files");
  const dest = join("src", "fs", "files_copy");

  try {
    await fs.access(src);

    try {
      await fs.access(dest);
      // If access succeeds, it means 'files_copy' exists, so we throw error
      throw new Error("Destination already exists");
    } catch (error) {
      // If access fails, it means 'files_copy' does not exist — good, we proceed
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Recursively copy folder
    await fs.cp(src, dest, { recursive: true });
    console.log("Folder copied successfully.");
  } catch (error) {
    console.error(error.message);
    throw new Error("FS operation failed");
  }
};

await copy();
