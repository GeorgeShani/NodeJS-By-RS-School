import { createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";
import { join } from "path";

const decompress = async () => {
  const sourcePath = join("src", "zip", "files", "archive.gz");
  const destinationPath = join("src", "zip", "files", "fileToCompress.txt");

  // Create a readable stream from the compressed archive
  const readStream = createReadStream(sourcePath);

  // Create a writable stream to write decompressed data
  const writeStream = createWriteStream(destinationPath);

  // Create a Gzip transform stream
  const gzip = createGzip();

  // Pipe the streams: read -> gzip -> write
  readStream.pipe(gzip).pipe(writeStream);

  // Handle stream events (e.g., when finished or error occurs)
  writeStream.on("finish", () => {
    console.log("File decompressed successfully.");
  });

  writeStream.on("error", (error) => {
    console.error("Error decompressing file:", error.message);
  });
};

await decompress();
