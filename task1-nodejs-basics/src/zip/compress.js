import { createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";
import { join } from "path";

const compress = async () => {
  // Define paths for the source file and destination compressed file
  const sourcePath = join("src", "zip", "files", "fileToCompress.txt");
  const destinationPath = join("src", "zip", "files", "archive.gz");

  // Create a readable stream from the source file
  const readStream = createReadStream(sourcePath);

  // Create a writable stream to the destination compressed file
  const writeStream = createWriteStream(destinationPath);

  // Create a Gzip transform stream
  const gzip = createGzip();

  // Pipe the streams: read -> gzip -> write
  readStream.pipe(gzip).pipe(writeStream);

  // Handle stream events (e.g., when finished or error occurs)
  writeStream.on("finish", () => {
    console.log("File compressed successfully.");
  });

  writeStream.on("error", (error) => {
    console.error("Error compressing file:", error.message);
  });
};

await compress();