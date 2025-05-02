import { resolveFilePath, fileExists } from "../utils.js";
import { createReadStream } from "fs";
import crypto from "crypto";

// Calculate file hash
const calculateHash = async (filePath) => {
  try {
    const resolvedPath = resolveFilePath(filePath);

    // Check if file exists
    if (!fileExists(resolvedPath)) {
      throw new Error("File does not exist");
    }

    const fileStream = createReadStream(resolvedPath);
    const hash = crypto.createHash("sha256");

    fileStream.on("data", (chunk) => {
      hash.update(chunk);
    });

    return new Promise((resolve, reject) => {
      fileStream.on("end", () => {
        console.log(hash.digest("hex"));
        resolve();
      });

      fileStream.on("error", reject);
    });
  } catch (error) {
    throw new Error("Failed to calculate hash");
  }
};

export { calculateHash };
