import { createWriteStream } from "fs";
import { join } from "path";

const write = async () => {
  // Construct the full path to the file
  const filePath = join("src", "streams", "files", "fileToWrite.txt");

  // Create a writable stream for the file
  const stream = createWriteStream(filePath);

  // Pipe stdin to the writable stream
  process.stdin.pipe(stream);

  // Listen for the 'finish' event after writing is complete
  stream.on("finish", () => {
    console.log("Data has been written to the file.");
  });

  // Listen for 'error' events on the writable stream
  stream.on("error", (err) => {
    console.error(`Error writing to file: ${err.message}`);
  });

  // Listen for 'error' events on stdin
  process.stdin.on("error", (err) => {
    console.error(`Error reading from stdin: ${err.message}`);
    stream.end(); // End the writable stream on stdin error
  });
};

await write();
