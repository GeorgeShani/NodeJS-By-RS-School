import cluster, { Worker } from "cluster";
import dotenv from "dotenv";
import http from "http";
import { cpus } from "os";
import { createServer } from "./server";

// Load environment variables
dotenv.config();

// Get port from environment or use default
const BASE_PORT = parseInt(process.env.PORT || "4000", 10);

// Number of available CPU cores minus one
const numCPUs = Math.max(1, cpus().length - 1);

// Worker ports management
const workerPorts: number[] = [];
for (let i = 0; i < numCPUs; i++) {
  workerPorts.push(BASE_PORT + i + 1);
} 

// Data synchronization between workers
interface SyncMessage {
  type: "sync";
  users: any[];
}

// Implementation for primary process
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Load balancer running on http://localhost:${BASE_PORT}/api`);
  console.log(`Setting up ${numCPUs} workers...`);

  // Store worker references
  const workers: { [key: number]: Worker } = {};

  // Track current worker index for round-robin
  let currentWorkerIndex = 0;

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ WORKER_PORT: workerPorts[i] });
    if (worker.id) {
      workers[worker.id] = worker;
    }

    console.log(`Worker started on port ${workerPorts[i]}`);
  }

  // Handle messages from workers for data synchronization
  for (const id in workers) {
    if (Object.prototype.hasOwnProperty.call(workers, id)) {
      workers[id].on("message", (msg: SyncMessage) => {
        if (msg.type === "sync") {
          // Broadcast to all other workers
          for (const workerId in workers) {
            if (workerId !== id) {
              workers[workerId].send(msg);
            }
          }
        }
      });
    }
  }

  // Handle worker crashes
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);

    const newWorker = cluster.fork({
      WORKER_PORT: workerPorts[(worker.id as number) % numCPUs],
    });

    if (newWorker.id) {
      workers[newWorker.id] = newWorker;
    }
  });

  // Create load balancer
  const loadBalancer = http.createServer((req, res) => {
    // Simple round-robin load balancing
    currentWorkerIndex = (currentWorkerIndex + 1) % numCPUs;
    const targetPort = workerPorts[currentWorkerIndex];

    // Create proxy request
    const options = {
      hostname: "localhost",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on("error", (error) => {
      console.error("Proxy request error:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Internal server error" }));
    });
  });

  loadBalancer.listen(BASE_PORT, () => {
    console.log(`Load balancer running on http://localhost:${BASE_PORT}`);
  });
} else {
  // Worker process
  const workerPort = parseInt(
    process.env.WORKER_PORT || `${BASE_PORT + 1}`,
    10
  );

  // Handle synchronization messages from primary
  process.on("message", (msg: SyncMessage) => {
    if (msg.type === "sync") {
      const { setUsers } = require("./db/in-memory-db");
      setUsers(msg.users);
    }
  });

  // Create HTTP server for the worker
  createServer(workerPort);

  // Hook into database operations to sync changes
  const { getUsersRef } = require("./db/in-memory-db");

  // Set up interval to sync data regularly
  setInterval(() => {
    if (process.send) {
      process.send({
        type: "sync",
        users: getUsersRef(),
      });
    }
  }, 500);
}