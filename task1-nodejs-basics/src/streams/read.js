import { createReadStream } from "fs";
import { join } from "path";

const read = async () => {
  // Construct the full path to the file
  const filePath = join("src", "streams", "files", "fileToRead.txt");

  // Create a readable stream from the file with UTF-8 encoding
  const stream = createReadStream(filePath, { encoding: "utf-8" });

  // Listen for 'data' events and write each chunk to stdout
  stream.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

  // Listen for the 'end' event and write a newline character
  stream.on("end", () => {
    process.stdout.write("\n");
  });

  // Listen for 'error' events and log any errors
  stream.on("error", (err) => {
    console.error(`Error reading file: ${err.message}`);
  });
};

await read();
