import path from "path";
import { fileURLToPath } from "url";
import { release, version } from "os";
import { createServer as createServerHttp } from "http";
import "./files/c.cjs";

// Set up file path variables in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a random number for conditional logic
const random = Math.random();

// Dynamically import JSON files with proper import attributes
const aJsonModule = await import('./files/a.json', { with: { type: 'json' } });
const bJsonModule = await import('./files/b.json', { with: { type: 'json' } });

// Extract default exports from the JSON modules
const aJson = aJsonModule.default;
const bJson = bJsonModule.default;

// Select one of the JSON objects based on random number
let unknownObject;
if (random > 0.5) {
  unknownObject = aJson;
} else {
  unknownObject = bJson;
}

// Log system information
console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${path.sep}"`);
console.log(`Path to current file is ${__filename}`);
console.log(`Path to current directory is ${__dirname}`);

// Create a simple HTTP server
const myServer = createServerHttp((_, res) => {
  res.end("Request accepted");
});

// Define the server port
const PORT = 3000;

// Log the selected JSON object
console.log(unknownObject);

// Start the server and log confirmation messages
myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log("To terminate it, use Ctrl+C combination");
});

// Export objects for use in other modules
export { unknownObject, myServer };
