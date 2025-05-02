import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { resolveFilePath, fileExists } from "../utils.js";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";

// Compress file using Brotli
const compressFile = async (sourcePath, destPath) => {
  try {
    const resolvedSourcePath = resolveFilePath(sourcePath);
    const resolvedDestPath = resolveFilePath(destPath);

    // Check if source file exists
    if (!fileExists(resolvedSourcePath)) {
      throw new Error("Source file does not exist");
    }

    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(resolvedDestPath);
    const brotliCompress = createBrotliCompress();

    // Use pipeline for proper error handling and cleanup
    await pipeline(readStream, brotliCompress, writeStream);
  } catch (error) {
    throw new Error("Failed to compress file");
  }
};

// Decompress file using Brotli
const decompressFile = async (sourcePath, destPath) => {
  try {
    const resolvedSourcePath = resolveFilePath(sourcePath);
    const resolvedDestPath = resolveFilePath(destPath);

    // Check if source file exists
    if (!fileExists(resolvedSourcePath)) {
      throw new Error("Source file does not exist");
    }

    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(resolvedDestPath);
    const brotliDecompress = createBrotliDecompress();

    // Use pipeline for proper error handling and cleanup
    await pipeline(readStream, brotliDecompress, writeStream);
  } catch (error) {
    throw new Error("Failed to decompress file");
  }
};

export { compressFile, decompressFile };
