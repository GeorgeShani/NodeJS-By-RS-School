import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const performCalculations = async () => {
  // Get the number of logical CPU cores available
  const numCores = os.cpus().length;
  const results = new Array(numCores).fill(null);
  const workers = [];

  // Create a promise that resolves when all workers have completed
  const workerPromises = [];

  // Create workers and assign tasks
  for (let i = 0; i < numCores; i++) {
    const workerPath = path.resolve(__dirname, "worker.js");
    const worker = new Worker(workerPath, {
      workerData: { index: i },
      type: "module", // Essential for ES modules
    });

    workers.push(worker);

    const workerPromise = new Promise((resolve) => {
      worker.on("message", (result) => {
        // Store the result in the results array at the correct index
        results[i] = result;
        resolve();
      });

      worker.on("error", (error) => {
        console.error("Worker error:", error.message);

        // Handle worker error
        results[i] = {
          status: "error",
          data: null,
        };

        resolve();
      });
    });

    workerPromises.push(workerPromise);

    // Send incremental number starting from 10
    const valueToSend = 10 + i;
    worker.postMessage(valueToSend);
  }

  // Wait for all workers to complete
  await Promise.all(workerPromises);

  // Terminate all workers
  for (const worker of workers) {
    await worker.terminate();
  }

  // Log the results
  console.log(results);
};

await performCalculations();