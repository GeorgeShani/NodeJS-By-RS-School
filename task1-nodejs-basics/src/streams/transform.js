import { Transform } from "stream";

const transform = async () => {
  // Create a custom Transform stream
  const reverseStream = new Transform({
    transform(chunk, encoding, callback) {
      // Reverse the chunk and push it to the output
      const reversed = chunk.toString().split("").reverse().join("");
      this.push(reversed);
      callback();
    },
  });

  // Pipe stdin -> transform (reverse) -> stdout
  process.stdin.pipe(reverseStream).pipe(process.stdout);
};

await transform();
