import { createReadStream } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const calculateHash = async () => {
  const filePath = join("src", "hash", "files", "fileToCalculateHashFor.txt");

  const hash = createHash("sha256"); // Create SHA256 hash instance
  const stream = createReadStream(filePath); // Create stream to read the file

  stream.on("data", (chunk) => {
    hash.update(chunk); // Update hash with each chunk of data
  });

  stream.on("end", () => {
    console.log(hash.digest("hex")); // Output final hash as hex string
  });

  stream.on("error", (error) => {
    console.error("Error reading the file:", error.message); // Handle read errors
  });
};

await calculateHash();
