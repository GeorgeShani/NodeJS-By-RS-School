import { promises as fs } from "fs";
import { join } from "path";

const create = async () => {
  const filePath = join("src", "fs", "files", "fresh.txt");
  const content = "I am fresh and young";

  try {
    await fs.writeFile(filePath, content, { flag: "wx" });
    console.log("File created successfully.");
  } catch (error) {
    console.error(error.message); // Show real error
    throw new Error("FS operation failed");
  }
};

await create();
