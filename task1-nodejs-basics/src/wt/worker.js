import { parentPort } from "worker_threads";

// n should be received from main thread
const nthFibonacci = (n) =>
  n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2);

// Listen for message from the main thread
parentPort.on("message", (n) => {
  try {
    const result = nthFibonacci(n);
    sendResult(result);
  } catch (error) {
    parentPort.postMessage({
      status: "error",
      data: null,
    });
  }
});

const sendResult = (result) => {
  // This function sends result of nthFibonacci computations to main thread
  parentPort.postMessage({
    status: "resolved",
    data: result,
  });
};